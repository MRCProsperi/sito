// Run once: node scripts/instagram-long-token.mjs
// Turns the short-lived token from the Graph API Explorer into a permanent Page token
// and writes INSTAGRAM_USER_ID / INSTAGRAM_ACCESS_TOKEN into .env.local.
// Before running, add these two temporary lines to .env.local (the script removes them afterwards):
//   INSTAGRAM_SHORT_TOKEN=<token from the Graph API Explorer, "Access Token" box>
//   INSTAGRAM_APP_SECRET=<App settings > Basic > App secret>
import fs from "node:fs";

const ENV_FILE = ".env.local";
const APP_ID = "1705905047862983";
let env = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, "utf8") : "";
const get = (k) => (env.match(new RegExp(`^\\s*${k}\\s*=\\s*(.*)\\s*$`, "m")) || [])[1]?.replace(/^["']|["']$/g, "").trim();
const set = (k, v) => {
    const re = new RegExp(`^\\s*${k}\\s*=.*$`, "m");
    env = re.test(env) ? env.replace(re, () => `${k}=${v}`) : env.replace(/\n*$/, "\n") + `${k}=${v}\n`;
};
const unset = (k) => { env = env.replace(new RegExp(`^\\s*${k}\\s*=.*\\r?\\n?`, "m"), ""); };

const shortToken = get("INSTAGRAM_SHORT_TOKEN");
const secret = get("INSTAGRAM_APP_SECRET");
if (!shortToken || !secret) {
    console.error("Mancano INSTAGRAM_SHORT_TOKEN o INSTAGRAM_APP_SECRET in .env.local");
    process.exit(1);
}

async function call(url) {
    const res = await fetch(url);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error?.message || `risposta ${res.status}`);
    return json;
}

try {
    const long = await call(`https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${encodeURIComponent(secret)}&fb_exchange_token=${encodeURIComponent(shortToken)}`);
    const accounts = await call(`https://graph.facebook.com/v21.0/me/accounts?fields=name,access_token,instagram_business_account&access_token=${encodeURIComponent(long.access_token)}`);
    const page = (accounts.data || []).find((p) => p.instagram_business_account?.id);
    if (!page) throw new Error("nessuna Pagina con account Instagram collegato (controlla di aver scelto la Pagina nel pop-up)");
    set("INSTAGRAM_USER_ID", page.instagram_business_account.id);
    set("INSTAGRAM_ACCESS_TOKEN", page.access_token);
    unset("INSTAGRAM_SHORT_TOKEN");
    unset("INSTAGRAM_APP_SECRET");
    fs.writeFileSync(ENV_FILE, env);
    console.log(`Fatto: Pagina "${page.name}", token permanente salvato in .env.local. Ora lancia: npm run build`);
} catch (err) {
    console.error(`Non riuscito: ${err.message}`);
    process.exit(1);
}
