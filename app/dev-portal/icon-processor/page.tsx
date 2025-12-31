"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Grid3X3,
  Sparkles,
  Download,
  Loader2,
  Image as ImageIcon,
  X,
  Check,
  Scissors,
  Wand2,
} from "lucide-react";

interface ProcessedImage {
  name: string;
  preview: string;
  customName?: string;
}

interface ProcessResult {
  success: boolean;
  totalIcons: number;
  cellDimensions: { width: number; height: number };
  images: ProcessedImage[];
  zipData: string;
  zipFileName: string;
}

// Common icon name suggestions
const ICON_NAME_SUGGESTIONS = [
  "megaphone", "microphone", "speaker", "voice", "sound", "audio",
  "play", "video", "camera", "broadcast", "podcast", "record",
  "ai", "brain", "spark", "magic", "lightning", "neural",
  "rocket", "growth", "chart", "target", "crown", "diamond",
  "trophy", "star", "globe", "shield", "heart", "check",
];

export default function IconProcessorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"png" | "webp">("png");
  const [prefix, setPrefix] = useState("brandvoice");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [customNames, setCustomNames] = useState<Record<number, string>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setImageName(file.name);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const processImage = async () => {
    if (!image) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);
    setCustomNames({});
    setEditingIndex(null);

    try {
      const response = await fetch("/api/icon-processor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: image,
          rows,
          cols,
          removeBackground,
          outputFormat,
          prefix,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Processing failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileName = (index: number, originalName: string): string => {
    if (customNames[index]) {
      const ext = originalName.split('.').pop() || 'png';
      return `${customNames[index]}.${ext}`;
    }
    return originalName;
  };

  const updateCustomName = (index: number, name: string) => {
    // Sanitize the name
    const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
    setCustomNames(prev => ({ ...prev, [index]: sanitized }));
  };

  const hasCustomNames = Object.keys(customNames).length > 0;

  const downloadZip = async () => {
    if (!result?.zipData) return;

    // If no custom names, download original ZIP directly
    if (!hasCustomNames) {
      const link = document.createElement("a");
      try {
        link.href = result.zipData;
        link.download = result.zipFileName;
        document.body.appendChild(link);
        link.click();
      } finally {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
      }
      return;
    }

    // With custom names, we need to repack the ZIP
    const JSZip = (await import('jszip')).default;

    // Load the original ZIP
    const base64Data = result.zipData.replace(/^data:application\/zip;base64,/, "");
    const originalZip = await JSZip.loadAsync(base64Data, { base64: true });

    // Create new ZIP with renamed files
    const newZip = new JSZip();
    const originalFiles = Object.keys(originalZip.files).sort();

    for (let i = 0; i < originalFiles.length; i++) {
      const originalName = originalFiles[i];
      const newName = getFileName(i, originalName);
      const content = await originalZip.files[originalName].async("blob");
      newZip.file(newName, content);
    }

    // Generate and download
    const content = await newZip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);

    const link = document.createElement("a");
    try {
      link.href = url;
      link.download = result.zipFileName.replace(".zip", "_renamed.zip");
      document.body.appendChild(link);
      link.click();
    } finally {
      if (link.parentNode) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setRows(Math.max(1, Math.min(10, isNaN(value) ? 1 : value)));
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCols(Math.max(1, Math.min(10, isNaN(value) ? 1 : value)));
  };

  const clearImage = () => {
    setImage(null);
    setImageName("");
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dev-portal"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dev Portal</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-purple-400" />
                Icon Processor
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Split grids & remove backgrounds</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Settings */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : image
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-purple-500/5"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {image ? (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">{imageName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      aria-label="Clear image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative rounded-xl overflow-hidden bg-black/40">
                    <img
                      src={image}
                      alt="Uploaded grid"
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                    {/* Grid overlay preview */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: `${100 / cols}% ${100 / rows}%`,
                      }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-2">
                    Grid preview: {cols} × {rows} = {cols * rows} icons
                  </p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-lg font-medium text-white mb-2">
                    Drop your icon grid here
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <span className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-colors">
                    Select Image
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Settings */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-purple-400" />
                Grid Settings
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cols-input" className="block text-sm font-medium text-white mb-2">
                    Columns
                  </label>
                  <input
                    id="cols-input"
                    type="number"
                    min="1"
                    max="10"
                    value={cols}
                    onChange={handleColsChange}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="rows-input" className="block text-sm font-medium text-white mb-2">
                    Rows
                  </label>
                  <input
                    id="rows-input"
                    type="number"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={handleRowsChange}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="prefix-input" className="block text-sm font-medium text-white mb-2">
                  File Prefix
                </label>
                <input
                  id="prefix-input"
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="brandvoice"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-300 mt-1">
                  Output: {prefix}_00.{outputFormat}, {prefix}_01.{outputFormat}, ...
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="format-select" className="block text-sm font-medium text-white mb-2">
                    Format
                  </label>
                  <select
                    id="format-select"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as "png" | "webp")}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="png">PNG (Lossless)</option>
                    <option value="webp">WebP (Smaller)</option>
                  </select>
                </div>
                <div>
                  <span className="block text-sm font-medium text-white mb-2">
                    Background
                  </span>
                  <button
                    type="button"
                    onClick={() => setRemoveBackground(!removeBackground)}
                    aria-pressed={removeBackground}
                    className={`w-full px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      removeBackground
                        ? "bg-purple-600 border-purple-500 text-white"
                        : "bg-black/40 border-white/10 text-gray-400 hover:border-purple-500/50"
                    }`}
                  >
                    <Wand2 className="w-4 h-4" />
                    {removeBackground ? "Removing BG" : "Keep BG"}
                  </button>
                </div>
              </div>

              {removeBackground && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-yellow-400">
                    Background removal uses Replicate API (~$0.001/image).
                    Requires REPLICATE_API_TOKEN in environment.
                  </p>
                </div>
              )}
            </div>

            {/* Process Button */}
            <button
              type="button"
              onClick={processImage}
              disabled={!image || isProcessing}
              aria-busy={isProcessing}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                !image || isProcessing
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  Processing {cols * rows} icons...
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5" aria-hidden="true" />
                  Split into {cols * rows} Icons
                </>
              )}
            </button>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Download Card */}
                <div className="rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border border-purple-500/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {result.totalIcons} Icons Ready
                      </h3>
                      <p className="text-gray-400">
                        {result.cellDimensions.width} × {result.cellDimensions.height}px each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={downloadZip}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold flex items-center gap-2 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25"
                    >
                      <Download className="w-5 h-5" aria-hidden="true" />
                      Download ZIP
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">
                    {result.zipFileName}
                  </p>
                </div>

                {/* Preview Grid with Rename */}
                <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-400" />
                      Preview & Rename
                    </h3>
                    <p className="text-xs text-gray-400">Click icon to rename</p>
                  </div>
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(cols, 6)}, 1fr)`,
                    }}
                  >
                    {result.images.map((img, index) => (
                      <div
                        key={index}
                        className={`rounded-lg bg-black/40 border p-2 cursor-pointer transition-all ${
                          editingIndex === index
                            ? "border-purple-500 ring-2 ring-purple-500/50"
                            : "border-white/10 hover:border-purple-500/50"
                        }`}
                        onClick={() => setEditingIndex(index)}
                      >
                        <div className="aspect-square mb-2">
                          <img
                            src={img.preview}
                            alt={getFileName(index, img.name)}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={customNames[index] || img.name.replace(/\.[^/.]+$/, "")}
                            onChange={(e) => updateCustomName(index, e.target.value)}
                            onBlur={() => setEditingIndex(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingIndex(null);
                              if (e.key === "Tab") {
                                e.preventDefault();
                                setEditingIndex(index < result.images.length - 1 ? index + 1 : 0);
                              }
                            }}
                            autoFocus
                            className="w-full px-2 py-1 text-xs bg-purple-600/20 border border-purple-500 rounded text-white focus:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className={`text-xs truncate text-center ${
                            customNames[index] ? "text-green-400" : "text-gray-400"
                          }`}>
                            {customNames[index] || img.name.replace(/\.[^/.]+$/, "")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Quick name suggestions */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Quick suggestions (click to apply to selected):</p>
                    <div className="flex flex-wrap gap-1">
                      {ICON_NAME_SUGGESTIONS.slice(0, 12).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            if (editingIndex !== null) {
                              updateCustomName(editingIndex, suggestion);
                              setEditingIndex(editingIndex < result.images.length - 1 ? editingIndex + 1 : null);
                            }
                          }}
                          disabled={editingIndex === null}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            editingIndex !== null
                              ? "bg-purple-600/20 text-purple-300 hover:bg-purple-600/40"
                              : "bg-white/5 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                  <Grid3X3 className="w-10 h-10 text-purple-400/50" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No results yet
                </h3>
                <p className="text-gray-400 max-w-sm">
                  Upload an icon grid image and configure your settings, then click
                  &quot;Split&quot; to process your icons.
                </p>
              </div>
            )}

            {/* Quick Tips */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>
                    <strong className="text-gray-300">Nano Banana Pro:</strong> Generate a 6×5 grid for 30 icons
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>
                    <strong className="text-gray-300">Grid Preview:</strong> Purple lines show how your image will be split
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>
                    <strong className="text-gray-300">WebP Format:</strong> 30-50% smaller files, great for web
                  </span>
                </li>
              </ul>
            </div>

            {/* Free Background Removal */}
            <div className="rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-green-400" />
                Free Background Removal
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Remove backgrounds locally for free using our Python script with Rembg:
              </p>
              <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <div className="text-gray-400 mb-2"># After downloading your split icons:</div>
                <div>cd ~/Downloads</div>
                <div>unzip icons.zip -d icons</div>
                <div className="mt-2">python3 scripts/remove-backgrounds.py ./icons</div>
              </div>
              <p className="text-xs text-gray-300 mt-3">
                Requires: pip3 install rembg onnxruntime pillow --user
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
