import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import JSZip from "jszip";

export const runtime = "nodejs";
export const maxDuration = 60;

// Constants for validation
const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const MAX_ROWS = 10;
const MAX_COLS = 10;
const MAX_PREFIX_LENGTH = 50;
const REPLICATE_POLL_TIMEOUT_MS = 55000; // 55 seconds (under maxDuration)
const REPLICATE_POLL_INTERVAL_MS = 1000;

interface ProcessRequest {
  imageData: string;
  rows: number;
  cols: number;
  removeBackground: boolean;
  outputFormat: string;
  prefix: string;
}

interface ProcessedImage {
  name: string;
  preview: string;
}

/**
 * Sanitize filename prefix to prevent path traversal and invalid characters
 */
function sanitizePrefix(prefix: string | undefined): string {
  if (!prefix) return "icon";
  return prefix
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, MAX_PREFIX_LENGTH);
}

/**
 * Validate output format
 */
function validateOutputFormat(format: string | undefined): "png" | "webp" {
  if (format === "webp") return "webp";
  return "png";
}

/**
 * Remove background using Replicate API with proper timeout and error handling
 */
async function removeBackgroundReplicate(imageBuffer: Buffer): Promise<Buffer> {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  if (!REPLICATE_API_TOKEN) {
    console.log("No Replicate API token, skipping background removal");
    return imageBuffer;
  }

  const startTime = Date.now();

  try {
    const base64 = imageBuffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64}`;

    // Start the prediction
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        input: { image: dataUri },
      }),
    });

    if (!response.ok) {
      console.error(`Replicate API error: ${response.status} ${response.statusText}`);
      return imageBuffer;
    }

    const prediction = await response.json();

    if (prediction.error) {
      console.error("Replicate error:", prediction.error);
      return imageBuffer;
    }

    // Poll for completion with timeout
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      // Check timeout
      if (Date.now() - startTime > REPLICATE_POLL_TIMEOUT_MS) {
        console.error("Replicate polling timed out");
        return imageBuffer;
      }

      await new Promise((resolve) => setTimeout(resolve, REPLICATE_POLL_INTERVAL_MS));

      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
        }
      );

      if (!pollResponse.ok) {
        console.error(`Replicate poll error: ${pollResponse.status}`);
        return imageBuffer;
      }

      result = await pollResponse.json();
    }

    if (result.status === "failed") {
      console.error("Replicate prediction failed:", result.error);
      return imageBuffer;
    }

    // Validate output URL exists
    const outputUrl = result.output;
    if (!outputUrl || typeof outputUrl !== "string") {
      console.error("No valid output URL from Replicate");
      return imageBuffer;
    }

    // Download the result image
    const outputResponse = await fetch(outputUrl);
    if (!outputResponse.ok) {
      console.error(`Failed to download result: ${outputResponse.status}`);
      return imageBuffer;
    }

    const outputBuffer = Buffer.from(await outputResponse.arrayBuffer());
    return outputBuffer;

  } catch (error) {
    console.error("Background removal error:", error);
    return imageBuffer;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessRequest = await request.json();
    const { imageData, rows, cols, removeBackground } = body;

    // Validate required fields
    if (!imageData || typeof imageData !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid imageData" },
        { status: 400 }
      );
    }

    // Validate image size (prevent DoS)
    if (imageData.length > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Image too large. Maximum size is ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate rows and cols
    const validRows = typeof rows === "number" && rows >= 1 && rows <= MAX_ROWS;
    const validCols = typeof cols === "number" && cols >= 1 && cols <= MAX_COLS;

    if (!validRows || !validCols) {
      return NextResponse.json(
        { error: `Rows and cols must be numbers between 1 and ${MAX_ROWS}` },
        { status: 400 }
      );
    }

    // Sanitize and validate other inputs
    const sanitizedPrefix = sanitizePrefix(body.prefix);
    const outputFormat = validateOutputFormat(body.outputFormat);

    // Decode base64 image
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    let imageBuffer: Buffer;

    try {
      imageBuffer = Buffer.from(base64Data, "base64");
    } catch {
      return NextResponse.json(
        { error: "Invalid base64 image data" },
        { status: 400 }
      );
    }

    // Validate image can be processed
    let metadata;
    try {
      metadata = await sharp(imageBuffer).metadata();
    } catch {
      return NextResponse.json(
        { error: "Invalid or corrupted image file" },
        { status: 400 }
      );
    }

    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: "Could not read image dimensions" },
        { status: 400 }
      );
    }

    const cellWidth = Math.floor(metadata.width / cols);
    const cellHeight = Math.floor(metadata.height / rows);

    if (cellWidth < 1 || cellHeight < 1) {
      return NextResponse.json(
        { error: "Image too small for the specified grid dimensions" },
        { status: 400 }
      );
    }

    // Create ZIP file
    const zip = new JSZip();
    const processedImages: ProcessedImage[] = [];

    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const left = col * cellWidth;
        const top = row * cellHeight;

        // Extract cell
        let cellBuffer = await sharp(imageBuffer)
          .extract({
            left,
            top,
            width: cellWidth,
            height: cellHeight,
          })
          .toBuffer();

        // Remove background if requested
        if (removeBackground) {
          cellBuffer = await removeBackgroundReplicate(cellBuffer);
        }

        // Convert to output format
        const outputBuffer = outputFormat === "webp"
          ? await sharp(cellBuffer).webp({ quality: 90 }).toBuffer()
          : await sharp(cellBuffer).png().toBuffer();

        const fileName = `${sanitizedPrefix}_${String(index).padStart(2, "0")}.${outputFormat}`;

        // Add to ZIP
        zip.file(fileName, outputBuffer);

        // Create preview (smaller version for UI)
        const previewBuffer = await sharp(cellBuffer)
          .resize(100, 100, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toBuffer();

        processedImages.push({
          name: fileName,
          preview: `data:image/png;base64,${previewBuffer.toString("base64")}`,
        });

        index++;
      }
    }

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const zipBase64 = zipBuffer.toString("base64");

    return NextResponse.json({
      success: true,
      totalIcons: rows * cols,
      cellDimensions: { width: cellWidth, height: cellHeight },
      images: processedImages,
      zipData: `data:application/zip;base64,${zipBase64}`,
      zipFileName: `${sanitizedPrefix}_${rows}x${cols}.zip`,
    });

  } catch (error) {
    console.error("Icon processor error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Processing failed" },
      { status: 500 }
    );
  }
}
