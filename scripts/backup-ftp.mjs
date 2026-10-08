// Downloads the whole remote hosting (FTP_REMOTE_DIR) into ./vecchio as a backup. Read-only on the server.
// Resumable: files already downloaded with the same size are skipped; reconnects on errors.
// Usage: node scripts/backup-ftp.mjs
import { Client } from "basic-ftp";
import fs from "node:fs";
import path from "node:path";

for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_REMOTE_DIR = "/", FTP_SECURE = "true" } = process.env;
const DEST = "vecchio";
const SKIP = new Set(["virtusvelletri.it_Backup_Giornaliero", "virtusvelletri.it_Backup_Settimanale"]); // Aruba automatic backups, not needed
let client, done = 0, skipped = 0, failed = [];

async function connect() {
    client?.close();
    client = new Client(120000);
    await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASSWORD, secure: FTP_SECURE !== "false", secureOptions: { servername: "ftplnx02.aruba.it" } });
}
async function retry(fn, tries = 5) {
    for (let i = 1; ; i++) {
        try { return await fn(); }
        catch (err) {
            if (i >= tries) throw err;
            await new Promise((r) => setTimeout(r, 2000 * i));
            await connect();
        }
    }
}
async function walk(remote, local) {
    fs.mkdirSync(local, { recursive: true });
    const list = await retry(() => client.list(remote));
    for (const e of list) {
        if (e.name === "." || e.name === ".." || SKIP.has(e.name)) continue;
        const r = remote.replace(/\/$/, "") + "/" + e.name;
        const l = path.join(local, e.name);
        if (e.isDirectory) await walk(r, l);
        else if (e.isFile) {
            if (fs.existsSync(l) && fs.statSync(l).size === e.size) { skipped++; continue; }
            try { await retry(() => client.downloadTo(l, r)); done++; }
            catch (err) { failed.push(`${r}: ${err.message}`); }
            if ((done + skipped) % 200 === 0) console.log(`... ${done} scaricati, ${skipped} già presenti`);
        }
    }
}
try {
    await connect();
    await walk(FTP_REMOTE_DIR, DEST);
    console.log(`Backup finito: ${done} scaricati, ${skipped} già presenti, ${failed.length} falliti.`);
    for (const f of failed) console.log("FALLITO", f);
    if (failed.length) process.exitCode = 1;
} catch (err) {
    console.error("Backup interrotto:", err.message);
    process.exitCode = 1;
} finally {
    client?.close();
}
