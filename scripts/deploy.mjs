// Uploads ./out to the Aruba hosting via FTP(S).
// Credentials come from .env.local (git-ignored), never from the repo:
//   FTP_HOST=...  FTP_USER=...  FTP_PASSWORD=...  FTP_REMOTE_DIR=/www   (FTP_SECURE=false to disable TLS)
// Usage: npm run deploy            (uploads)
//        npm run deploy -- --dry   (lists what would be uploaded)
import { Client } from "basic-ftp";
import fs from "node:fs";
import path from "node:path";

function loadEnvFile(file) {
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
        if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
}
loadEnvFile(".env.local");

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_DIR = "/", FTP_SECURE = "true" } = process.env;
const dry = process.argv.includes("--dry");
const outDir = path.resolve("out");

if (!fs.existsSync(path.join(outDir, "index.html"))) {
    console.error("Cartella out/ mancante: esegui prima `npm run build`.");
    process.exit(1);
}
if (!dry && (!FTP_HOST || !FTP_USER || !FTP_PASSWORD)) {
    console.error("Mancano FTP_HOST, FTP_USER o FTP_PASSWORD in .env.local");
    process.exit(1);
}

function* walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(full);
        else yield full;
    }
}

if (dry) {
    let n = 0;
    for (const f of walk(outDir)) { n++; console.log(path.relative(outDir, f)); }
    console.log(`\n${n} file in out/ (dry run, nessun upload)`);
    process.exit(0);
}

let client;
async function connect() {
    client?.close();
    client = new Client(120000);
    await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASSWORD, secure: FTP_SECURE !== "false", secureOptions: { servername: "ftplnx02.aruba.it" } });
}
async function retry(fn, tries = 6) {
    for (let i = 1; ; i++) {
        try { return await fn(); }
        catch (err) {
            if (i >= tries) throw err;
            await new Promise((r) => setTimeout(r, 2000 * i));
            await connect();
        }
    }
}

// Only adds/overwrites files: it never deletes anything already on the server.
// Switch-over files go last, so the old site keeps working until the new one is complete.
const LAST = new Set(["index.html", ".htaccess"]);
const files = [...walk(outDir)].map((f) => path.relative(outDir, f).split(path.sep).join("/"));
files.sort((a, b) => Number(LAST.has(a)) - Number(LAST.has(b)));

try {
    await connect();
    const base = FTP_REMOTE_DIR.replace(/\/$/, "");
    const made = new Set();
    let sent = 0, skipped = 0;
    for (const rel of files) {
        const local = path.join(outDir, rel);
        const remote = `${base}/${rel}`;
        const dir = path.posix.dirname(remote);
        await retry(async () => {
            if (!made.has(dir)) { await client.ensureDir(dir); made.add(dir); }
            const size = fs.statSync(local).size;
            let same = false;
            if (!LAST.has(rel)) { try { same = (await client.size(remote)) === size; } catch { /* not there yet */ } }
            if (same) { skipped++; return; }
            await client.uploadFrom(local, remote);
            sent++;
        });
        if ((sent + skipped) % 100 === 0) console.log(`... ${sent} caricati, ${skipped} già presenti (${sent + skipped}/${files.length})`);
    }
    console.log(`Upload completato su ${FTP_HOST}:${FTP_REMOTE_DIR}: ${sent} caricati, ${skipped} già presenti.`);
} catch (err) {
    console.error("Deploy fallito:", err.message);
    process.exitCode = 1;
} finally {
    client?.close();
}
