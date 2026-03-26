from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np
import math

# --- Datos S&P 500 mensuales Ene 1993 – Dic 1998 ---
sp500 = [
    435,443,451,440,450,450,448,453,459,467,461,466,  # 1993
    472,468,445,443,451,444,456,473,465,472,453,459,  # 1994
    470,487,500,514,533,544,562,561,584,581,605,615,  # 1995
    636,640,645,654,669,670,639,651,687,705,736,741,  # 1996
    786,790,757,801,848,885,954,899,947,983,955,970,  # 1997
    980,1021,1082,1112,1091,1133,1120,957,1017,1099,1164,1229  # 1998
]

BASE = sp500[0]
N = len(sp500)
stocks_pct = [((v - BASE) / BASE) * 100 for v in sp500]
cash_pct   = [-13 * (i / (N - 1)) for i in range(N)]

# --- Config video ---
W, H   = 400, 700
FPS    = 30
SECS   = 22
FRAMES = FPS * SECS

# Márgenes del gráfico
ML, MR, MT, MB = 65, 70, 95, 110
CW = W - ML - MR
CH = H - MT - MB
Y_MAX, Y_MIN = 200, -20

def to_x(idx_f): return ML + (idx_f / (N - 1)) * CW
def to_y(val):   return MT + CH - ((val - Y_MIN) / (Y_MAX - Y_MIN)) * CH

def lerp(a, b, t): return a + (b - a) * t

def ease_in_out(t):
    if t < 0.5: return 2 * t * t
    return -1 + (4 - 2 * t) * t

def get_at_progress(p):
    idx = p * (N - 1)
    lo  = min(int(idx), N - 2)
    hi  = lo + 1
    t   = idx - lo
    return idx, lerp(stocks_pct[lo], stocks_pct[hi], t), lerp(cash_pct[lo], cash_pct[hi], t)

def format_date(p):
    total_months = p * (N - 1)
    year  = 1993 + int(total_months // 12)
    month = int(total_months % 12) + 1
    return f"{month}/1/{str(year)[-2:]}"

# Intentar cargar fuente, si no usar default
try:
    font_title  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
    font_label  = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 13)
    font_axis   = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 11)
    font_date   = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
    font_label2 = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
except:
    font_title = font_label = font_axis = font_date = font_label2 = ImageFont.load_default()

GREEN = (0, 232, 122)
RED   = (255, 64, 64)
WHITE = (255, 255, 255)
GRAY  = (136, 136, 136)
BG    = (8, 8, 8)
GRID  = (30, 30, 30)

def draw_frame(progress):
    img  = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    idx_f, stocks_val, cash_val = get_at_progress(progress)
    n = int(idx_f)

    # --- Título ---
    title = '"Las Acciones Son una Estafa"'
    bbox  = draw.textbbox((0, 0), title, font=font_title)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, 28), title, fill=WHITE, font=font_title)

    # --- Grid y etiquetas Y ---
    for tick in [0, 50, 100, 150]:
        y = to_y(tick)
        draw.line([(ML, y), (ML + CW, y)], fill=GRID, width=1)
        label = f"{tick}%"
        bbox  = draw.textbbox((0, 0), label, font=font_axis)
        tw    = bbox[2] - bbox[0]
        draw.text((ML - tw - 6, y - 6), label, fill=GRAY, font=font_axis)

    # --- Eje X base (línea 0%) ---
    y0 = to_y(0)
    draw.line([(ML, y0), (ML + CW, y0)], fill=(60, 60, 60), width=1)

    # --- Etiquetas X ---
    for label, xi in [("1/1/93", 0), ("1/1/95", 24), ("1/1/97", 48)]:
        x = to_x(xi)
        bbox = draw.textbbox((0, 0), label, font=font_axis)
        tw = bbox[2] - bbox[0]
        draw.text((x - tw / 2, MT + CH + 10), label, fill=GRAY, font=font_axis)

    # --- Línea Cash ---
    if n > 0:
        pts = []
        for i in range(n + 1):
            pts.append((to_x(i), to_y(cash_pct[i])))
        # Punto interpolado parcial
        if idx_f > n and n < N - 1:
            pts.append((to_x(idx_f), to_y(cash_val)))
        if len(pts) >= 2:
            draw.line(pts, fill=RED, width=2)

    # --- Línea Acciones ---
    if n > 0:
        pts = []
        for i in range(n + 1):
            pts.append((to_x(i), to_y(stocks_pct[i])))
        if idx_f > n and n < N - 1:
            pts.append((to_x(idx_f), to_y(stocks_val)))
        if len(pts) >= 2:
            draw.line(pts, fill=GREEN, width=3)

    # --- Labels en punta de líneas ---
    if progress > 0.04:
        ex = to_x(idx_f)

        # Acciones
        sy  = to_y(stocks_val)
        lbl = f"Acciones {stocks_val:.0f}%"
        draw.text((ex + 6, sy - 8), lbl, fill=GREEN, font=font_label2)

        # Efectivo
        cy  = to_y(cash_val)
        lbl = f"Efectivo {cash_val:.0f}%"
        draw.text((ex + 6, cy - 2), lbl, fill=RED, font=font_label)

    # --- Fecha grande abajo ---
    date_str = format_date(progress)
    size = int(38 + progress * 6)
    try:
        f_date = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
    except:
        f_date = font_date
    bbox = draw.textbbox((0, 0), date_str, font=f_date)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) / 2, H - 60), date_str, fill=WHITE, font=f_date)

    return np.array(img)

# --- Generar video ---
out_path = "/home/user/cosasconclaude/stocks-vs-cash.mp4"
fourcc   = cv2.VideoWriter_fourcc(*'mp4v')
writer   = cv2.VideoWriter(out_path, fourcc, FPS, (W, H))

print(f"Generando {FRAMES} frames...")
for f in range(FRAMES):
    raw_p = f / (FRAMES - 1)
    p     = ease_in_out(raw_p)
    frame = draw_frame(p)
    # PIL es RGB, OpenCV espera BGR
    writer.write(cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
    if f % 60 == 0:
        print(f"  Frame {f}/{FRAMES} ({100*f//FRAMES}%)")

writer.release()
print(f"Video guardado: {out_path}")
