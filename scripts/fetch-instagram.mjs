// Runs before every `npm run build` (npm "prebuild" hook).
// Downloads the latest Instagram posts into public/instagram and writes content/config/instagram.json,
// so the static site never hot-links Instagram images (their URLs expire after a few days).
// Needs INSTAGRAM_ACCESS_TOKEN in .env.local (see INSTAGRAM_SETUP.md). Without it, or on any error,
// the previous posts are kept: this script never makes the build fail.
import fs from "node:fs";
import path from "node:path";

const ENV_FILE = ".env.local";
const OUT_JSON = path.resolve("content/config/instagram.json");
const OUT_DIR = path.resolve("public/instagram");
const MAX_POSTS = 6;

function readEnvFile() {
    return fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, "utf8") : "";
}
function envValue(text, key) {
    const m = text.match(new RegExp(`^\\s*${key}\\s*=\\s*(.*)\\s*$`, "m"));
    return m ? m[1].replace(/^["']|["']$/g, "") : undefined;
}

const envText = readEnvFile();
const token = process.env.INSTAGRAM_ACCESS_TOKEN || envValue(envText, "INSTAGRAM_ACCESS_TOKEN");
// Facebook-login mode: INSTAGRAM_USER_ID is the id of the Instagram professional account linked to the Facebook Page,
// INSTAGRAM_ACCESS_TOKEN is then a long-lived Page token (does not expire, no refresh needed).
const igUserId = process.env.INSTAGRAM_USER_ID || envValue(envText, "INSTAGRAM_USER_ID");

if (!token) {
    console.log("[instagram] nessun token: lascio i post esistenti.");
    process.exit(0);
}

async function graph(url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Instagram API ha risposto ${res.status}`);
    return res.json();
}

let fetched = false;
try {
    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const { data } = await graph(igUserId ? `https://graph.facebook.com/v21.0/${igUserId}/media?fields=${fields}&limit=12` : `https://graph.instagram.com/me/media?fields=${fields}&limit=12`);
    if (!Array.isArray(data)) throw new Error("risposta inattesa");

    const picked = data
        .map((p) => ({ ...p, src: p.media_type === "VIDEO" ? p.thumbnail_url : p.media_url }))
        .filter((p) => p.src && p.permalink)
        .slice(0, MAX_POSTS);

    fs.mkdirSync(OUT_DIR, { recursive: true });
    const posts = [];
    for (const p of picked) {
        const res = await fetch(p.src);
        if (!res.ok || !(res.headers.get("content-type") || "").startsWith("image/")) continue;
        const file = `${p.id}.jpg`;
        let img = Buffer.from(await res.arrayBuffer());
        try { // shrink for the web (sharp ships with Next); on any failure keep the original
            const { default: sharp } = await import("sharp");
            img = await sharp(img).rotate().resize({ width: 800, withoutEnlargement: true }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
        } catch { /* keep original */ }
        fs.writeFileSync(path.join(OUT_DIR, file), img);
        posts.push({
            id: p.id,
            caption: (p.caption || "").replace(/\s+/g, " ").trim().slice(0, 140),
            permalink: p.permalink,
            image: `/instagram/${file}`,
            timestamp: p.timestamp,
        });
    }

    if (posts.length === 0) throw new Error("nessuna immagine scaricata");

    // remove images of posts that are no longer in the grid
    const keep = new Set(posts.map((p) => path.basename(p.image)));
    for (const f of fs.readdirSync(OUT_DIR)) if (!keep.has(f)) fs.unlinkSync(path.join(OUT_DIR, f));

    fs.writeFileSync(OUT_JSON, JSON.stringify(posts, null, 2) + "\n");
    console.log(`[instagram] ${posts.length} post aggiornati.`);
    fetched = true;
} catch (err) {
    // no process.exit() here: on Node 24 + Windows it can abort (libuv assertion) while fetch handles are closing
    console.warn(`[instagram] aggiornamento non riuscito (${err.message}): lascio i post esistenti.`);
}

// Keep the 60-day token alive: every build asks for a fresh one and stores it in .env.local.
try {
    if (!fetched) throw new Error("skip"); // fetch failed: nothing to refresh
    if (igUserId) throw new Error("skip"); // Page tokens do not expire
    if (!envValue(envText, "INSTAGRAM_ACCESS_TOKEN")) throw new Error("skip"); // token came from the environment, not from the file
    const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
    if (res.ok) {
        const { access_token, expires_in } = await res.json();
        if (access_token && access_token !== token) {
            const updated = envText.replace(/^(\s*INSTAGRAM_ACCESS_TOKEN\s*=).*$/m, () => `INSTAGRAM_ACCESS_TOKEN=${access_token}`);
            fs.writeFileSync(ENV_FILE, updated);
        }
        console.log(`[instagram] token rinnovato (valido ancora ${Math.round((expires_in || 0) / 86400)} giorni).`);
    }
} catch {
    // refresh is best effort: the current token stays valid until it expires
}
