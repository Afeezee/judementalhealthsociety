/**
 * Generate the site favicons from public/jmhs-brain.png.
 *
 * Outputs (all under src/app/, using Next.js 16 App Router's file-based
 * icon convention — no <head> tags to hand-manage):
 *
 *   - icon.png        512x512, transparent (browsers auto-scale)
 *   - apple-icon.png  180x180, brain on solid paper background
 *                     (iOS home screen doesn't render transparent icons well)
 *   - favicon.ico     32x32 PNG-embedded ICO for legacy /favicon.ico requests
 *
 * Idempotent — safe to re-run whenever public/jmhs-brain.png changes.
 * Not wired into `next dev` / `next build` because favicons rarely change
 * and we don't want the extra I/O on every dev boot. Run manually:
 *
 *   npx tsx scripts/build-favicons.ts
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "jmhs-brain.png");
const APP_DIR = path.join(ROOT, "src", "app");

// The paper/canvas colour behind the brain on the Apple touch icon.
// #F6F7FB is --paper from the design tokens (globals.css:17). We keep
// it solid so iOS home-screen backgrounds don't bleed through.
const PAPER_RGB = { r: 246, g: 247, b: 251, alpha: 1 };

async function generateSquareBrain(size: number, opts: {
  padPct: number;
  background: { r: number; g: number; b: number; alpha: number };
}): Promise<Buffer> {
  const inner = Math.round(size * (1 - opts.padPct * 2));
  // Fit the brain inside `inner`x`inner` preserving aspect, then centre it
  // on a `size`x`size` canvas of the requested background colour.
  const resized = await sharp(SRC)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: opts.background,
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toBuffer();
}

/**
 * Wrap a single 32x32 PNG in the ICO container.
 * ICO layout: 6-byte header + one 16-byte directory entry + PNG bytes.
 *   header:    reserved(2)=0, type(2)=1 icon, count(2)=1
 *   dir entry: w(1), h(1), colors(1)=0, reserved(1)=0, planes(2)=1,
 *              bpp(2)=32, dataSize(4), dataOffset(4)
 * width/height of 0 mean 256 — we use 32 so both bytes are 32.
 */
function pngToIco(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);        // reserved
  header.writeUInt16LE(1, 2);        // type: icon
  header.writeUInt16LE(1, 4);        // count: 1
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);            // no palette
  entry.writeUInt8(0, 3);            // reserved
  entry.writeUInt16LE(1, 4);         // colour planes
  entry.writeUInt16LE(32, 6);        // bpp
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(6 + 16, 12);   // offset: past header + this entry
  return Buffer.concat([header, entry, png]);
}

async function main() {
  await fs.access(SRC).catch(() => {
    throw new Error(`Source not found: ${SRC}`);
  });

  // icon.png — transparent, generous padding so the mark reads at any size.
  const iconPng = await generateSquareBrain(512, {
    padPct: 0.14,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  await fs.writeFile(path.join(APP_DIR, "icon.png"), iconPng);

  // apple-icon.png — solid paper background, slightly tighter padding.
  const applePng = await generateSquareBrain(180, {
    padPct: 0.16,
    background: PAPER_RGB,
  });
  await fs.writeFile(path.join(APP_DIR, "apple-icon.png"), applePng);

  // favicon.ico — 32x32 PNG-embedded. Transparent so it works on both
  // light and dark browser chromes.
  const faviconPng = await generateSquareBrain(32, {
    padPct: 0.06,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  const ico = pngToIco(faviconPng, 32);
  await fs.writeFile(path.join(APP_DIR, "favicon.ico"), ico);

  console.log("✓ Wrote src/app/icon.png (512x512, transparent)");
  console.log("✓ Wrote src/app/apple-icon.png (180x180, paper bg)");
  console.log("✓ Wrote src/app/favicon.ico (32x32 PNG-in-ICO)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
