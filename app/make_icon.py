"""Create icon.ico from bigten_icon.png. Requires: pip install pillow"""

import os

try:
    from PIL import Image
except ImportError:
    print("Run: pip install pillow")
    raise

_APP_DIR = os.path.dirname(os.path.abspath(__file__))
png_path = os.path.join(_APP_DIR, "bigten_icon.png")
ico_path = os.path.join(_APP_DIR, "bigten_icon.ico")

if os.path.exists(png_path):
    img = Image.open(png_path).convert("RGBA")
    img.save(ico_path, format="ICO", sizes=[(256, 256), (48, 48), (32, 32), (16, 16)])
    print(f"Created: {ico_path}")
else:
    print(f"Missing: {png_path}")
