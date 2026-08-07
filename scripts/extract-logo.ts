/**
 * One-off asset build: take the official JMHS Logo PNG and produce:
 *  - public/jmhs-brain.png       — brain icon only, WHITE removed → transparent
 *  - public/jmhs-wordmark.png    — text portion only, WHITE removed → transparent
 *
 * The header renders <img src="/jmhs-brain.png"> plus HTML text so both
 * themes work: brain PNG stays blue, text is HTML that follows --fg.
 * jmhs-wordmark.png is kept for social/OG use when we need the full lockup.
 *
 * Run:  npx tsx scripts/extract-logo.ts
 */
import sharp from "sharp";
import path from "path";

const SRC = path.resolve("public/jmhs-logo.png");
const BRAIN_OUT = path.resolve("public/jmhs-brain.png");

const WHITE_THRESHOLD = 240; // pixels with R,G,B all >= this become transparent

async function makeTransparent(buf: Buffer, info: sharp.OutputInfo) {
  const px = new Uint8ClampedArray(buf);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      px[i + 3] = 0;
    }
  }
  return sharp(Buffer.from(px), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function findContentBounds(buf: Buffer, info: sharp.OutputInfo) {
  const px = new Uint8ClampedArray(buf);
  const { width, height } = info;
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = px[i + 3];
      if (a > 32) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function main() {
  // 1 — full PNG with white → transparent
  const { data: rgbaData, info: rgbaInfo } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const transparentBuf = await makeTransparent(rgbaData, rgbaInfo);

  // 2 — read back as raw again to locate the brain component.
  // The brain is the LEFT-most non-white cluster. We split on the
  // horizontal midpoint between logo pieces by scanning columns for
  // a run of fully-transparent pixels.
  const { data: transPx, info: transInfo } = await sharp(transparentBuf)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = transInfo;
  const colHasContent = new Uint8Array(width);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const a = transPx[(y * width + x) * 4 + 3];
      if (a > 32) { colHasContent[x] = 1; break; }
    }
  }
  // Find first content column, then scan for a WIDE gap that separates
  // the brain block from the wordmark block. Small gaps (e.g. the slit
  // between hemispheres, ~1–3 empty columns) don't count.
  const GAP_MIN = 40; // wider than any within-brain gap
  let firstContentX = 0;
  while (firstContentX < width && !colHasContent[firstContentX]) firstContentX++;

  let x = firstContentX;
  let brainEndX = width;
  while (x < width) {
    if (!colHasContent[x]) {
      let runStart = x;
      while (x < width && !colHasContent[x]) x++;
      const runLen = x - runStart;
      if (runLen >= GAP_MIN) {
        brainEndX = runStart;
        break;
      }
    } else {
      x++;
    }
  }

  const MARGIN = 20;
  const cropLeft = Math.max(0, firstContentX - MARGIN);
  const cropRight = Math.min(width, brainEndX + MARGIN);

  // Crop brain slab, then trim its vertical bounds tightly.
  const brainSlab = await sharp(transparentBuf)
    .extract({ left: cropLeft, top: 0, width: cropRight - cropLeft, height })
    .png()
    .toBuffer();

  const { data: slabPx, info: slabInfo } = await sharp(brainSlab)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bounds = await findContentBounds(slabPx, slabInfo);

  await sharp(brainSlab)
    .extract(bounds)
    .png({ compressionLevel: 9 })
    .toFile(BRAIN_OUT);

  console.log("✓ wrote", BRAIN_OUT);
  console.log("  size:", bounds.width, "x", bounds.height);
}

main().catch((e) => { console.error(e); process.exit(1); });
