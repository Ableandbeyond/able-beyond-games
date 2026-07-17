import os
from pathlib import Path
from PIL import Image

def compress_images():
    base_dir = Path(r"c:\apps\life-skills-app\images")
    if not base_dir.exists():
        print("Images directory not found")
        return
        
    for p in base_dir.rglob("*.png"):
        try:
            with Image.open(p) as img:
                print(f"Compressing {p}")
                # Keep aspect ratio, bounding box of 400x400
                img.thumbnail((400, 400), Image.Resampling.LANCZOS)
                # Save optimized
                img.save(p, "PNG", optimize=True)
            print(f"Success: {p}")
        except Exception as e:
            print(f"Failed to compress {p}: {e}")

if __name__ == "__main__":
    compress_images()
