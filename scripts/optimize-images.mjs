// Recompresses heavy images in public/ in place (same file names and formats). Originals stay in git.
// Usage: node scripts/optimize-images.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const MIN_BYTES = 120 * 1024;
const MAX_WIDTH = (file) => (/hero/i.test(file) ? 1920 : 800);

function* walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) yield* walk(full);
        else yield full;
    }
}

let before = 0, after = 0;
for (const file of walk("public")) {
    const ext = path.extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
    if (file.split(path.sep).join("/").startsWith("public/images/news/")) continue; // news graphics must stay full resolution
    const size = fs.statSync(file).size;
    if (size < MIN_BYTES) continue;
    const img = sharp(file, { failOn: "none" }).rotate().resize({ width: MAX_WIDTH(file), withoutEnlargement: true });
    const out = ext === ".png"
        ? await img.png({ palette: true, quality: 85, compressionLevel: 9, effort: 8 }).toBuffer()
        : await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    if (out.length < size) {
        fs.writeFileSync(file + ".tmp", out);
        fs.renameSync(file + ".tmp", file);
        before += size; after += out.length;
        console.log(`${(size / 1024) | 0}K -> ${(out.length / 1024) | 0}K  ${file}`);
    }
}
console.log(`\nTotale: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
