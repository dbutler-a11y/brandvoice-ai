#!/usr/bin/env python3
"""
Batch Background Removal - FREE using Rembg
Usage: python remove-backgrounds.py <input_folder> [output_folder]

Examples:
  python remove-backgrounds.py ./icons
  python remove-backgrounds.py ./icons ./icons-nobg
  python remove-backgrounds.py ~/Downloads/split ./final

Supports: PNG, JPG, JPEG, WEBP
Output: PNG with transparent background
"""

import sys
import os
from pathlib import Path

# Constants
MAX_FILE_SIZE_MB = 100
SUPPORTED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp'}


def batch_remove_backgrounds(input_dir: str, output_dir: str = None):
    """Remove backgrounds from all images in a folder."""

    try:
        from rembg import remove, new_session
        from PIL import Image
    except ImportError:
        print("Error: rembg not installed")
        print("Install with: pip3 install rembg onnxruntime pillow --user")
        sys.exit(1)

    input_path = Path(input_dir)
    if not input_path.exists():
        print(f"Error: Input folder not found: {input_dir}")
        sys.exit(1)

    # Set output directory
    if output_dir:
        output_path = Path(output_dir)
    else:
        output_path = input_path / "nobg"

    output_path.mkdir(parents=True, exist_ok=True)

    # Find all images
    images = [f for f in input_path.iterdir()
              if f.is_file() and f.suffix.lower() in SUPPORTED_EXTENSIONS]

    if not images:
        print(f"No images found in {input_dir}")
        print(f"Supported formats: {', '.join(SUPPORTED_EXTENSIONS)}")
        sys.exit(1)

    print(f"\n{'='*50}")
    print(f"REMBG Batch Background Removal (FREE)")
    print(f"{'='*50}")
    print(f"Input:  {input_path}")
    print(f"Output: {output_path}")
    print(f"Images: {len(images)}")
    print(f"{'='*50}\n")

    # Create a single session for efficiency (model loaded once)
    print("Loading AI model (first time may download ~300MB)...")
    session = new_session("u2net")
    print("Model loaded!\n")

    # Process images
    successful = 0
    failed = 0

    for i, img_path in enumerate(images, 1):
        output_file = output_path / f"{img_path.stem}_nobg.png"

        # Check file size
        file_size_mb = img_path.stat().st_size / (1024 * 1024)
        if file_size_mb > MAX_FILE_SIZE_MB:
            print(f"  [{i}/{len(images)}] SKIP {img_path.name} (too large: {file_size_mb:.1f}MB)")
            failed += 1
            continue

        try:
            with Image.open(img_path) as img:
                # Convert to RGBA if needed
                if img.mode != 'RGBA':
                    img = img.convert('RGBA')
                output = remove(img, session=session)
                output.save(output_file, "PNG")

            print(f"  [{i}/{len(images)}] OK {img_path.name}")
            successful += 1

        except Exception as e:
            print(f"  [{i}/{len(images)}] ERR {img_path.name}: {e}")
            failed += 1

    print(f"\n{'='*50}")
    print(f"COMPLETE!")
    print(f"{'='*50}")
    print(f"Successful: {successful}")
    print(f"Failed:     {failed}")
    print(f"Output:     {output_path}")
    print(f"{'='*50}\n")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        print("\nQuick start:")
        print("  1. Download your split icons from the web tool")
        print("  2. Unzip to a folder (e.g., ~/Downloads/icons)")
        print("  3. Run: python3 remove-backgrounds.py ~/Downloads/icons")
        print("  4. Find results in ~/Downloads/icons/nobg/")
        sys.exit(0)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None

    batch_remove_backgrounds(input_dir, output_dir)


if __name__ == "__main__":
    main()
