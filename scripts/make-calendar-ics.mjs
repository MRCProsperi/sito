// Builds iCalendar (.ics) files from content/matches/*.md into public/calendari/.
// One file per team plus one with every team. Runs before every build (npm "prebuild").
// Phones and calendar apps can download the file or subscribe to it (webcal://) and stay updated.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE = "www.virtusvelletri.it";
const OUT = "public/calendari";
const DURATION_MIN = 120; // matches have no end time: assume 2 hours

const escapeText = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
// RFC 5545: lines max 75 octets, continuation lines start with a space
function fold(line) {
    const out = [];
    let cur = "";
    for (const ch of line) {
        if (Buffer.byteLength(cur + ch) > 73) { out.push(cur); cur = " " + ch; } else cur += ch;
    }
    out.push(cur);
    return out.join("\r\n");
}
const pad = (n) => String(n).padStart(2, "0");
const stamp = (d, t) => `${d.replace(/-/g, "")}T${t.replace(":", "")}00`;
function addMinutes(date, time, minutes) {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, hh, mm + minutes));
    return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`;
}

const VTIMEZONE = [
    "BEGIN:VTIMEZONE", "TZID:Europe/Rome",
    "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0200", "TZNAME:CEST", "DTSTART:19700329T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
    "BEGIN:STANDARD", "TZOFFSETFROM:+0200", "TZOFFSETTO:+0100", "TZNAME:CET", "DTSTART:19701025T030000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
    "END:VTIMEZONE",
];

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
    const text = fs.readFileSync(path.join("content/matches", file), "utf8");
    return parseEvents(text)
        .filter((e) => e.title && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && /^\d{1,2}:\d{2}$/.test(e.time))
        .map((e) => ({ ...e, time: e.time.padStart(5, "0") }))
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

function build(name, matches, file) {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Virtus Velletri//Calendario//IT", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
        `X-WR-CALNAME:${escapeText(name)}`, "X-WR-TIMEZONE:Europe/Rome", "REFRESH-INTERVAL;VALUE=DURATION:PT12H", "X-PUBLISHED-TTL:PT12H", ...VTIMEZONE];
    for (const m of matches) {
        const uid = `${file}-${m.date}-${m.time.replace(":", "")}-${m.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}@${SITE}`;
        lines.push("BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:20260101T000000Z`,
            `DTSTART;TZID=Europe/Rome:${stamp(m.date, m.time)}`, `DTEND;TZID=Europe/Rome:${addMinutes(m.date, m.time, DURATION_MIN)}`,
            `SUMMARY:${escapeText(`${m.category ? m.category + ": " : ""}${m.title}`)}`);
        if (m.location) lines.push(`LOCATION:${escapeText(m.location)}`);
        lines.push(`DESCRIPTION:${escapeText("Il calendario può subire variazioni: fanno fede gli aggiornamenti del Comitato Regionale Lazio. https://" + SITE + "/calendario/")}`,
            "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Partita tra 2 ore", "END:VALARM", "END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    return lines.map(fold).join("\r\n") + "\r\n";
}

const NAMES = { dr1: "Virtus Velletri - DR1", "under-17": "Virtus Velletri - Under 17", amatoriale: "Virtus Velletri - Amatori", "under-13": "Virtus Velletri - Under 13", "under-14": "Virtus Velletri - Under 14", "under-15": "Virtus Velletri - Under 15" };

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const all = [];
for (const f of fs.readdirSync("content/matches").filter((x) => x.endsWith(".md"))) {
    const team = f.replace(/\.md$/, "");
    const matches = readMatches(f);
    if (!matches.length) continue;
    all.push(...matches.map((m) => ({ ...m, _team: team })));
    fs.writeFileSync(path.join(OUT, `${team}.ics`), build(NAMES[team] || `Virtus Velletri - ${team}`, matches, team));
    console.log(`[ics] ${team}.ics: ${matches.length} partite.`);
}
if (all.length) {
    all.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    fs.writeFileSync(path.join(OUT, "tutte-le-squadre.ics"), build("Virtus Velletri - Tutte le squadre", all, "tutte"));
    console.log(`[ics] tutte-le-squadre.ics: ${all.length} partite.`);
}
