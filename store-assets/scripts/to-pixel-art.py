#!/usr/bin/env python3
"""Convert master icon to limited-palette pixel art (nearest-neighbor upscale)."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

# Retro earthy palette (no dithering)
PALETTE = [
    (15, 15, 20),       # outline
    (45, 32, 28),       # dark hair
    (92, 58, 42),       # shadow skin
    (196, 140, 98),     # skin
    (232, 198, 156),    # highlight skin
    (58, 110, 118),     # glass rim dark
    (86, 168, 176),     # glass teal
    (178, 228, 232),    # lens highlight
    (140, 88, 52),      # handle brown
    (245, 235, 210),    # background cream
    (255, 255, 255),    # white glint
]


def nearest_palette_color(rgba: tuple[int, int, int, int]) -> tuple[int, int, int, int]:
    r, g, b, a = rgba
    if a < 128:
        return (245, 235, 210, 255)
    best = PALETTE[0]
    best_d = float("inf")
    for pr, pg, pb in PALETTE:
        d = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2
        if d < best_d:
            best_d = d
            best = (pr, pg, pb)
    return (*best, 255)


def snap_to_palette(small: Image.Image) -> Image.Image:
    px = small.load()
    w, h = small.size
    out = Image.new("RGBA", (w, h))
    opx = out.load()
    for y in range(h):
        for x in range(w):
            opx[x, y] = nearest_palette_color(px[x, y])
    return out


def add_pixel_outline(img: Image.Image, outline: tuple[int, int, int, int] = (15, 15, 20, 255)) -> Image.Image:
    w, h = img.size
    src = img.load()
    out = img.copy()
    dst = out.load()
    for y in range(h):
        for x in range(w):
            if src[x, y][3] < 128:
                continue
            for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
                nx, ny = x + dx, y + dy
                if nx < 0 or ny < 0 or nx >= w or ny >= h:
                    dst[x, y] = outline
                    break
                if src[nx, ny][3] < 128:
                    continue
                if src[nx, ny][:3] != src[x, y][:3]:
                    # keep outline only on background-adjacent edges optionally
                    pass
    # Outline: dark pixel where neighbor is background
    bg = (245, 235, 210, 255)
    for y in range(h):
        for x in range(w):
            if src[x, y] == bg:
                continue
            for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, 1), (1, -1), (-1, 1)):
                nx, ny = x + dx, y + dy
                if nx < 0 or ny < 0 or nx >= w or ny >= h:
                    dst[x, y] = outline
                    break
                if src[nx, ny] == bg:
                    dst[x, y] = outline
                    break
    return out


def load_master(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    side = min(w, h)
    left, top = (w - side) // 2, (h - side) // 2
    return img.crop((left, top, left + side, top + side))


def pixel_art(img: Image.Image, grid: int = 48) -> Image.Image:
    small = img.resize((grid, grid), Image.Resampling.BOX)
    snapped = snap_to_palette(small)
    return add_pixel_outline(snapped)


def export(pix: Image.Image, ext_dir: Path, store_dir: Path) -> None:
    g = pix.size[0]
    pix.save(store_dir / f"icon-pixel-grid-{g}x{g}.png", optimize=True)
    for size in (16, 48, 128):
        pix.resize((size, size), Image.Resampling.NEAREST).save(
            ext_dir / f"icon{size}.png",
            optimize=True,
        )
    pix.resize((128, 128), Image.Resampling.NEAREST).save(
        store_dir / "chrome-store-icon-128.png",
        optimize=True,
    )
    pix512 = pix.resize((512, 512), Image.Resampling.NEAREST)
    pix512.save(store_dir / "icon-master-512.png", optimize=True)
    pix512.save(store_dir / "chrome-store-icon-512.png", optimize=True)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--grid", type=int, default=48, help="Pixel art base size (e.g. 32, 48)")
    p.add_argument(
        "--source",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "icons/icon-master-source.jpg",
    )
    args = p.parse_args()
    root = Path(__file__).resolve().parents[2]
    ext_dir = root / "extension/icons"
    store_dir = Path(__file__).resolve().parents[1] / "icons"
    master = load_master(args.source)
    art = pixel_art(master, grid=args.grid)
    export(art, ext_dir, store_dir)
    print(f"Pixel art {args.grid}x{args.grid} -> icons written")


if __name__ == "__main__":
    main()