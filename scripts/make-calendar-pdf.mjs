// Builds the downloadable season calendars (A4 PDF) from content/matches/*.md into public/pdf/.
// Runs before every build (npm "prebuild"), so the PDFs always match the match data shown on the site.
// Usage: node scripts/make-calendar-pdf.mjs
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs";
import matter from "gray-matter";

const SEASON = "2026/27";
const CALENDARS = [
    { file: "dr1", title: "DR1", subtitle: `Stagione ${SEASON}`, out: "calendario-dr1-2026-27.pdf" },
    { file: "under-17", title: "UNDER 17", subtitle: `Under 17 Gold · Fase di qualificazione · Stagione ${SEASON}`, out: "calendario-under-17-2026-27.pdf" },
];

const BLUE = rgb(0x1f / 255, 0x32 / 255, 0x5a / 255);
const GOLD = rgb(0xf7 / 255, 0xa2 / 255, 0x11 / 255);
const HOME_BG = rgb(0.99, 0.93, 0.8);
const ROW_BG = rgb(0.96, 0.97, 0.99);
const DAYS = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];

// Standard PDF fonts only cover Latin-1: normalise anything else
const latin = (s) => String(s).replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[^\x20-\x7E\xA0-\xFF]/g, "");

// Reads the events with a real YAML parser, so it works whether the file is written by hand or saved by the CMS.
const asDate = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? ""));
const asTime = (v) => (typeof v === "number" ? `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}` : String(v ?? ""));
function parseEvents(text) {
    const { data } = matter(text);
    return (data.events || []).map((e) => ({
        title: String(e.title ?? ""), date: asDate(e.date), time: asTime(e.time), location: String(e.location ?? ""), category: String(e.category ?? ""),
    }));
}

function readMatches(file) {
    const text = fs.readFileSync(`content/matches/${file}.md`, "utf8");
    return parseEvents(text).filter((e) => e.title && /^\d{4}-\d{2}-\d{2}$/.test(e.date))
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

function wrap(font, text, size, maxWidth, maxLines) {
    const words = latin(text).split(/\s+/);
    const lines = [];
    let cur = "";
    for (const w of words) {
        const next = cur ? `${cur} ${w}` : w;
        if (font.widthOfTextAtSize(next, size) <= maxWidth) cur = next;
        else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    if (lines.length > maxLines) {
        lines.length = maxLines;
        let last = lines[maxLines - 1];
        while (font.widthOfTextAtSize(`${last}...`, size) > maxWidth && last.length > 1) last = last.slice(0, -1);
        lines[maxLines - 1] = `${last}...`;
    }
    return lines;
}

async function build({ file, title, subtitle, out }) {
    const matches = readMatches(file);
    if (matches.length === 0) { console.log(`[calendar] ${file}: nessuna partita, salto.`); return; }

    const pdf = await PDFDocument.create();
    pdf.setTitle(`Calendario ${title} ${SEASON} - Virtus Velletri`);
    pdf.setAuthor("Virtus Velletri Basket");
    const page = pdf.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    const reg = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    const logo = await pdf.embedPng(fs.readFileSync("public/images/logo.png"));

    // header
    const headerH = 112;
    page.drawRectangle({ x: 0, y: height - headerH, width, height: headerH, color: BLUE });
    page.drawRectangle({ x: 0, y: height - headerH - 5, width, height: 5, color: GOLD });
    const logoH = 72;
    page.drawImage(logo, { x: 36, y: height - headerH / 2 - logoH / 2, width: logoH * (logo.width / logo.height), height: logoH });
    page.drawText("CALENDARIO", { x: 140, y: height - 50, size: 13, font: bold, color: GOLD });
    page.drawText(latin(title), { x: 140, y: height - 82, size: 32, font: bold, color: rgb(1, 1, 1) });
    page.drawText(latin(subtitle), { x: 140, y: height - 102, size: 9.5, font: reg, color: rgb(0.85, 0.88, 0.95) });
    const tag = "#WEAREVIRTUS";
    page.drawText(tag, { x: width - 36 - bold.widthOfTextAtSize(tag, 10), y: height - 50, size: 10, font: bold, color: GOLD });

    // table
    const top = height - headerH - 30;
    const bottom = 62;
    const colHead = top + 10;
    const rowH = Math.min(34, (top - bottom) / matches.length);
    const x = { n: 38, date: 62, time: 128, match: 164, place: 396 };
    const headFont = 7.5;
    for (const [label, cx] of [["#", x.n], ["DATA", x.date], ["ORA", x.time], ["PARTITA", x.match], ["LUOGO", x.place]]) {
        page.drawText(label, { x: cx, y: colHead, size: headFont, font: bold, color: BLUE });
    }
    page.drawLine({ start: { x: 36, y: colHead - 4 }, end: { x: width - 36, y: colHead - 4 }, thickness: 1.2, color: GOLD });

    matches.forEach((m, i) => {
        const yTop = top - i * rowH;
        const home = /^virtus velletri vs/i.test(m.title);
        const [home_, away_] = m.title.split(/\s+vs\s+/i);
        page.drawRectangle({ x: 36, y: yTop - rowH, width: width - 72, height: rowH, color: home ? HOME_BG : i % 2 ? ROW_BG : rgb(1, 1, 1) });
        const mid = yTop - rowH / 2;
        const d = new Date(`${m.date}T12:00:00`);
        const dateLabel = `${DAYS[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getFullYear()).slice(2)}`;

        page.drawText(String(i + 1), { x: x.n, y: mid - 3, size: 8, font: bold, color: BLUE });
        page.drawText(dateLabel, { x: x.date, y: mid - 3, size: 8.5, font: bold, color: BLUE });
        page.drawText(latin(m.time), { x: x.time, y: mid - 3, size: 8.5, font: reg, color: rgb(0.2, 0.2, 0.25) });

        // match: bold for our team
        const size = 8.5;
        const maxW = x.place - x.match - 10;
        const text = `${home_} - ${away_}`;
        const fits = bold.widthOfTextAtSize(latin(text), size) <= maxW;
        const fs_ = fits ? size : size - 1;
        let cx = x.match;
        for (const [name, isOurs, sep] of [[home_, /virtus velletri/i.test(home_), " - "], [away_, /virtus velletri/i.test(away_), ""]]) {
            const f = isOurs ? bold : reg;
            page.drawText(latin(name), { x: cx, y: mid - 3, size: fs_, font: f, color: isOurs ? BLUE : rgb(0.2, 0.2, 0.25) });
            cx += f.widthOfTextAtSize(latin(name), fs_);
            if (sep) { page.drawText(sep, { x: cx, y: mid - 3, size: fs_, font: reg, color: rgb(0.5, 0.5, 0.55) }); cx += reg.widthOfTextAtSize(sep, fs_); }
        }
        if (home) page.drawText("CASA", { x: x.match, y: mid - 12.5 < yTop - rowH + 2 ? yTop - rowH + 2 : mid - 12.5, size: 5.5, font: bold, color: GOLD });

        const lines = wrap(reg, m.location, 6.8, width - 36 - x.place - 4, 2);
        const lh = 7.6;
        lines.forEach((l, k) => page.drawText(l, { x: x.place, y: mid + ((lines.length - 1) / 2 - k) * lh - 2.4, size: 6.8, font: reg, color: rgb(0.3, 0.3, 0.36) }));
    });

    // footer
    page.drawLine({ start: { x: 36, y: 50 }, end: { x: width - 36, y: 50 }, thickness: 0.8, color: GOLD });
    page.drawText("Le partite in casa sono evidenziate. Il calendario puo subire variazioni: fanno fede gli aggiornamenti del Comitato Regionale Lazio.", { x: 36, y: 38, size: 6.8, font: reg, color: rgb(0.4, 0.4, 0.45) });
    page.drawText("www.virtusvelletri.it", { x: 36, y: 26, size: 8, font: bold, color: BLUE });
    const agg = `Aggiornato al ${new Date().toLocaleDateString("it-IT")}`;
    page.drawText(agg, { x: width - 36 - reg.widthOfTextAtSize(agg, 7), y: 26, size: 7, font: reg, color: rgb(0.4, 0.4, 0.45) });

    fs.mkdirSync("public/pdf", { recursive: true });
    fs.writeFileSync(`public/pdf/${out}`, await pdf.save());
    console.log(`[calendar] ${out}: ${matches.length} partite.`);
}

for (const c of CALENDARS) await build(c);
