// Copies the CMS panel (cms/) to public/admin/ so it is published at /admin/.
// It stays OFF until the file cms/ENABLED exists (see GUIDA-CMS-E-DEPLOY.md): a panel nobody can log into is just noise.
import fs from "node:fs";

fs.rmSync("public/admin", { recursive: true, force: true });
if (!fs.existsSync("cms/ENABLED")) {
    console.log("[cms] non attivo (manca cms/ENABLED): /admin non viene pubblicato.");
    process.exit(0);
}
fs.mkdirSync("public/admin", { recursive: true });
for (const f of ["index.html", "config.yml"]) fs.copyFileSync(`cms/${f}`, `public/admin/${f}`);
console.log("[cms] pannello pubblicato su /admin/.");
