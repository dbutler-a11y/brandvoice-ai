#!/usr/bin/env python3
"""
Icon Processor - Split grid images and remove backgrounds
Usage: python icon-processor.py <input_image> <rows> <cols> [output_dir]

Example: python icon-processor.py icons-grid.png 6 5 ./output
This will split a 6x5 grid into 30 separate icons with backgrounds removed.
"""

import subprocess
import sys
import os
from pathlib import Path

def split_grid(input_path: str, rows: int, cols: int, output_dir: str) -> list:
    """Split an image grid into individual files using ImageMagick."""

    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Get base name for output files
    base_name = Path(input_path).stem

    # Use ImageMagick to split the grid
    # -crop {cols}x{rows}@ splits into grid cells
    output_pattern = os.path.join(output_dir, f"{base_name}_%02d.png")

    cmd = [
        "magick",
        input_path,
        "-crop", f"{cols}x{rows}@",
        "+repage",
        output_pattern
    ]

    print(f"Splitting {input_path} into {rows}x{cols} = {rows*cols} icons...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return []

    # Get list of created files
    output_files = sorted(Path(output_dir).glob(f"{base_name}_*.png"))
    print(f"Created {len(output_files)} icon files")

    return [str(f) for f in output_files]


def remove_background(input_path: str, output_path: str = None) -> str:
    """Remove background from an image using rembg."""

    if output_path is None:
        p = Path(input_path)
        output_path = str(p.parent / f"{p.stem}_nobg.png")

    try:
        from rembg import remove
        from PIL import Image

        with Image.open(input_path) as img:
            output = remove(img)
            output.save(output_path)

        print(f"Background removed: {output_path}")
        return output_path

    except ImportError:
        print("rembg not available, skipping background removal")
        return input_path


def remove_backgrounds_batch(file_list: list, output_dir: str = None) -> list:
    """Remove backgrounds from multiple images."""

    if output_dir:
        Path(output_dir).mkdir(parents=True, exist_ok=True)

    results = []
    total = len(file_list)

    try:
        from rembg import remove
        from PIL import Image

        print(f"\nRemoving backgrounds from {total} images...")

        for i, input_path in enumerate(file_list, 1):
            p = Path(input_path)

            if output_dir:
                output_path = os.path.join(output_dir, f"{p.stem}_nobg.png")
            else:
                output_path = str(p.parent / f"{p.stem}_nobg.png")

            with Image.open(input_path) as img:
                output = remove(img)
                output.save(output_path)

            results.append(output_path)
            print(f"  [{i}/{total}] {p.name} -> {Path(output_path).name}")

        print(f"\nCompleted! {len(results)} images processed.")
        return results

    except ImportError:
        print("rembg not available. Install with: pip install rembg[cli] onnxruntime")
        return file_list


def process_icon_grid(input_path: str, rows: int, cols: int, output_dir: str = "./icons"):
    """Full pipeline: split grid and remove backgrounds."""

    # Create output directories
    split_dir = os.path.join(output_dir, "split")
    final_dir = os.path.join(output_dir, "final")

    # Step 1: Split the grid
    split_files = split_grid(input_path, rows, cols, split_dir)

    if not split_files:
        print("No files created from grid split")
        return

    # Step 2: Remove backgrounds
    final_files = remove_backgrounds_batch(split_files, final_dir)

    print(f"\n{'='*50}")
    print(f"COMPLETE!")
    print(f"Split icons:  {split_dir}")
    print(f"Final icons:  {final_dir}")
    print(f"Total icons:  {len(final_files)}")
    print(f"{'='*50}")


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        print("\nQuick test commands:")
        print("  # Split only (no background removal):")
        print("  magick input.png -crop 6x5@ +repage output_%02d.png")
        print("")
        print("  # With this script:")
        print("  python icon-processor.py grid.png 6 5 ./output")
        sys.exit(1)

    input_path = sys.argv[1]
    rows = int(sys.argv[2])
    cols = int(sys.argv[3])
    output_dir = sys.argv[4] if len(sys.argv) > 4 else "./icons"

    if not os.path.exists(input_path):
        print(f"Error: Input file not found: {input_path}")
        sys.exit(1)

    process_icon_grid(input_path, rows, cols, output_dir)


if __name__ == "__main__":
    main()
