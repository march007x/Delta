"""
สร้างรูปสำหรับแชร์ลิงก์ (Open Graph) ขนาด 1200x630 → public/og.png

รันด้วย:  python3 scripts/make-og.py

หมายเหตุเรื่องฟอนต์ไทย
----------------------
สคริปต์นี้จะมองหาฟอนต์ไทยในเครื่องก่อน ถ้าเจอจะใส่ข้อความไทยลงในรูปด้วย
ถ้าไม่เจอ (เช่นบนเซิร์ฟเวอร์ที่ไม่มีฟอนต์ไทย) จะข้ามบรรทัดภาษาไทยไปเงียบ ๆ
แทนที่จะวาดเป็นกล่องสี่เหลี่ยม  ถ้าอยากได้ข้อความไทยในรูป ให้รันสคริปต์นี้
บนเครื่องตัวเองที่มีฟอนต์ไทยติดตั้งอยู่ แล้ว commit ไฟล์ public/og.png ที่ได้
"""

import math
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (13, 16, 32)
GRID = (30, 36, 66)
INK = (233, 235, 246)
MUTED = (140, 148, 180)
ACCENT = (132, 150, 255)
DELTA = (227, 178, 103)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LATIN_CANDIDATES = [
    "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
THAI_KEYWORDS = ("thai", "sarabun", "kanit", "prompt", "noto sans thai", "loma", "garuda")


def find_latin(size):
    for path in LATIN_CANDIDATES:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def find_thai(size):
    try:
        out = subprocess.run(["fc-list"], capture_output=True, text=True, timeout=10).stdout
    except Exception:
        return None
    for line in out.splitlines():
        low = line.lower()
        if "italic" in low or "oblique" in low:
            continue
        if any(k in low for k in THAI_KEYWORDS):
            path = line.split(":")[0].strip()
            if os.path.exists(path):
                try:
                    return ImageFont.truetype(path, size)
                except Exception:
                    continue
    return None


img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# กระดาษกราฟ
for x in range(0, W, 40):
    d.line([(x, 0), (x, H)], fill=GRID, width=1)
for y in range(0, H, 40):
    d.line([(0, y), (W, y)], fill=GRID, width=1)

# พาราโบลาหงายขึ้น (a > 0) ให้ตรงกับสมการที่เขียนไว้ในภาพ
VX, VY, A = 880, 500, 0.0035
pts = []
for px in range(600, W + 1, 4):
    py = VY - A * (px - VX) ** 2   # แกน y ของภาพชี้ลง จึงต้องลบเพื่อให้กราฟหงาย
    if 0 <= py <= H:
        pts.append((px, py))
if len(pts) > 1:
    d.line(pts, fill=ACCENT, width=6, joint="curve")
d.ellipse([VX - 11, VY - 11, VX + 11, VY + 11], fill=DELTA)

# เครื่องหมาย Δ
cx, cy, r = 96, 96, 34
tri = [(cx, cy - r), (cx + r * math.sin(math.radians(60)), cy + r / 2),
       (cx - r * math.sin(math.radians(60)), cy + r / 2)]
d.polygon(tri, outline=ACCENT, width=7)

f_name = find_latin(88)
f_eq = find_latin(38)
f_small = find_latin(26)
f_thai = find_thai(40)
f_thai_small = find_thai(28)

d.text((150, 62), "Delta", font=f_name, fill=INK)
d.text((66, 250), "y = ax" + "²" + " + bx + c", font=f_eq, fill=MUTED)

if f_thai:
    d.text((66, 330), "เข้าใจคณิตศาสตร์ด้วยการทดลอง", font=f_thai, fill=INK)
    d.text((66, 386), "ไม่ใช่การท่องจำ", font=f_thai, fill=INK)
    d.text((66, 480), "ม.4 – ม.6  ·  กราฟโต้ตอบได้  ·  เรียนฟรี", font=f_thai_small, fill=MUTED)
else:
    d.text((66, 330), "Interactive Mathematics", font=f_eq, fill=INK)
    d.text((66, 386), "Grades 10-12  ·  Free", font=f_eq, fill=INK)
    d.text((66, 480), "drag  ·  explore  ·  understand", font=f_small, fill=MUTED)

out = os.path.join(ROOT, "public", "og.png")
img.save(out, "PNG", optimize=True)
print("เขียนไฟล์แล้ว:", out, f"({os.path.getsize(out) // 1024} KB)")
if not f_thai:
    print("หมายเหตุ: ไม่พบฟอนต์ไทยในเครื่องนี้ จึงใช้ข้อความภาษาอังกฤษแทน")
