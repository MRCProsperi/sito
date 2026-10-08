// Builds the web versions of the photo gallery and a manifest the site reads.
// Originals are NOT published (they can be big). For each photo this writes a thumbnail (-t.jpg) and a large
// version (-l.jpg) to public/galleria/<stagione>/<album>/, plus public/galleria/manifest.json.
// Runs before every build (npm "prebuild"). Photos already converted and unchanged are skipped.
//
// Two ways to define an album (both work):
//   1. Folder:  content/gallery/<stagione>/<album>/*.jpg        e.g. content/gallery/2026-27/dr1-vs-casilino/foto-01.jpg
//   2. CMS:     content/albums/<album>.md  with  title, season ("2026-27"), photos: [ "/uploads/foto-01.jpg", ... ]
//               (photo files uploaded to content/gallery/uploads/)
import sharp from "sharp";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

const FOLDER_SRC = "content/gallery";
const ALBUMS_SRC = "content/albums";
const UPLOADS = path.join(FOLDER_SRC, "uploads");
const OUT = "public/galleria";
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const safe = (s) => String(s).replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
const prettify = (slug) => {
    const t = slug.split(/[-_]+/).filter(Boolean).map((w) => (/^(dr\d|u\d+)$/i.test(w) ? w.toUpperCase() : w)).join(" ");
    return t.charAt(0).toUpperCase() + t.slice(1);
};

// ---- collect albums: { season, slug, title, files: [absolute/relative source paths in display order] }
const albums = [];

if (fs.existsSync(FOLDER_SRC)) {
    for (const season of fs.readdirSync(FOLDER_SRC, { withFileTypes: true }).filter((e) => e.isDirectory() && e.name !== "uploads")) {
        for (const album of fs.readdirSync(path.join(FOLDER_SRC, season.name), { withFileTypes: true }).filter((e) => e.isDirectory())) {
            const dir = path.join(FOLDER_SRC, season.name, album.name);
            const files = fs.readdirSync(dir).filter((f) => EXT.has(path.extname(f).toLowerCase())).sort().map((f) => path.join(dir, f));
            albums.push({ season: season.name, slug: album.name, title: prettify(album.name), files });
        }
    }
}

if (fs.existsSync(ALBUMS_SRC)) {
    for (const f of fs.readdirSync(ALBUMS_SRC).filter((x) => x.endsWith(".md"))) {
        const { data } = matter(fs.readFileSync(path.join(ALBUMS_SRC, f), "utf8"));
        const slug = safe(f.replace(/\.md$/, ""));
        const season = safe(data.season || "senza-stagione");
        const files = [];
        for (const p of data.photos || []) {
            const name = path.basename(String(typeof p === "string" ? p : p?.image || ""));
            const found = [path.join(UPLOADS, name), path.join(FOLDER_SRC, name)].find((c) => fs.existsSync(c));
            if (found) files.push(found); else console.warn(`[gallery] ${f}: foto non trovata: ${name}`);
        }
        albums.push({ season, slug, title: data.title || prettify(slug), files });
    }
}

if (!albums.length) {
    fs.rmSync(OUT, { recursive: true, force: true });
    console.log("[gallery] nessun album: salto.");
    process.exit(0);
}

const wanted = new Set();
const manifest = [];
let made = 0, skipped = 0;
for (const album of albums) {
    const outDir = path.join(OUT, album.season, album.slug);
    fs.mkdirSync(outDir, { recursive: true });
    const photos = [];
    for (const input of album.files) {
        const base = safe(path.basename(input, path.extname(input)));
        let ok = true;
        for (const [suffix, width, quality] of [["t", 480, 72], ["l", 1600, 78]]) {
            const out = path.join(outDir, `${base}-${suffix}.jpg`);
            wanted.add(path.resolve(out));
            if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(input).mtimeMs) { skipped++; continue; }
            try {
                await sharp(input, { failOn: "none" }).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toFile(out);
                made++;
            } catch (err) { ok = false; console.warn(`[gallery] ${input}: ${err.message}`); }
        }
        if (ok) photos.push(base);
    }
    if (photos.length) manifest.push({ season: album.season, slug: album.slug, title: album.title, photos });
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
wanted.add(path.resolve(path.join(OUT, "manifest.json")));

// remove derived files whose original was deleted
(function clean(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) { clean(full); if (!fs.readdirSync(full).length) fs.rmdirSync(full); }
        else if (!wanted.has(path.resolve(full))) fs.unlinkSync(full);
    }
})(OUT);

console.log(`[gallery] ${manifest.length} album, ${made} immagini create, ${skipped} già pronte.`);
