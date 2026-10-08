"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Navigation, ChevronRight, CalendarDays } from "lucide-react";
import { romeTimestamp } from "@/lib/time";

export interface NextMatchItem {
    title: string;
    category?: string;
    date: string;
    time?: string;
    location?: string;
    slug: string;
}

export interface TeamMatches {
    team: string;   // team slug, e.g. "dr1"
    label: string;  // e.g. "DR1"
    matches: NextMatchItem[]; // upcoming, in order
}

const MATCH_LENGTH = 2 * 3600_000; // a match counts as "next" until 2 hours after the start
const pad = (n: number) => String(n).padStart(2, "0");

// The list comes from the build, which can be old: pick the first match still to come at the visitor's moment
const pickCurrent = (team: TeamMatches, now: number | null) =>
    now === null ? team.matches[0] : team.matches.find((m) => romeTimestamp(m.date, m.time) + MATCH_LENGTH > now);

function MatchCard({ team, now }: { team: TeamMatches; now: number | null }) {
    const current = pickCurrent(team, now);

    if (!current) {
        return (
            <div className="rounded-2xl bg-virtus-blue p-8 text-center text-white shadow-xl">
                <p className="font-display text-xl font-black uppercase">Nessuna partita in programma</p>
                <Link href={`/calendario/${team.team}`} className="mt-3 inline-block text-sm font-bold uppercase tracking-wide text-virtus-yellow underline">Vedi il calendario</Link>
            </div>
        );
    }

    const start = romeTimestamp(current.date, current.time);
    const diff = now === null ? null : start - now;
    const live = diff !== null && diff <= 0;
    const positive = diff !== null && diff > 0 ? diff : 0;
    const units: [string, number][] = [
        ["Giorni", Math.floor(positive / 86400000)],
        ["Ore", Math.floor((positive % 86400000) / 3600000)],
        ["Min", Math.floor((positive % 3600000) / 60000)],
        ["Sec", Math.floor((positive % 60000) / 1000)],
    ];

    const when = new Date(`${current.date}T12:00:00`).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
    const maps = current.location ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(current.location)}` : null;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-virtus-blue p-6 text-white shadow-xl md:p-8">
            <svg className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 text-virtus-yellow opacity-25" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="50" cy="50" r="46" /><line x1="4" y1="50" x2="96" y2="50" /><line x1="50" y1="4" x2="50" y2="96" /><path d="M 17 17 C 38 36 38 64 17 83" /><path d="M 83 17 C 62 36 62 64 83 83" /></svg>
            <div className="relative grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
                <div>
                    <div className="mb-3 flex items-center gap-3">
                        <span className="rounded-full bg-virtus-yellow px-3 py-1 text-[10px] font-black uppercase tracking-widest text-virtus-blue">Prossima partita</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-white/70">{team.label}</span>
                    </div>
                    <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-tight md:text-4xl">{current.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
                        <span className="inline-flex items-center gap-2 capitalize"><Clock className="h-4 w-4 text-virtus-yellow" /> {when}{current.time ? `, ore ${current.time}` : ""}</span>
                        {current.location && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-virtus-yellow" /> {current.location}</span>}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        {maps && (
                            <a href={maps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-virtus-yellow px-4 py-2 text-xs font-black uppercase tracking-wide text-virtus-blue transition-colors hover:bg-white">
                                <Navigation className="h-4 w-4" /> Indicazioni stradali
                            </a>
                        )}
                        <Link href={`/partite/${current.slug}`} className="inline-flex items-center gap-1 rounded-lg border border-white/40 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors hover:border-virtus-yellow hover:text-virtus-yellow">
                            Dettagli <ChevronRight className="h-4 w-4" />
                        </Link>
                        <Link href={`/calendario/${team.team}`} className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors hover:border-virtus-yellow hover:text-virtus-yellow">
                            <CalendarDays className="h-4 w-4" /> Calendario {team.label}
                        </Link>
                    </div>
                </div>

                <div className="text-center" aria-live="off">
                    {live ? (
                        <p className="font-display text-3xl font-black uppercase text-virtus-yellow">In corso!</p>
                    ) : diff === null ? (
                        <div className="h-20" />
                    ) : (
                        <div className="grid grid-cols-4 gap-2">
                            {units.map(([label, value]) => (
                                <div key={label} className="rounded-xl bg-white/10 px-1 py-3">
                                    <div className="font-display text-3xl font-black tabular-nums md:text-4xl">{pad(value)}</div>
                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">{label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function NextMatch({ teams }: { teams: TeamMatches[] }) {
    const [now, setNow] = useState<number | null>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const tick = () => setNow(Date.now());
        const first = setTimeout(tick, 0);
        const id = setInterval(tick, 1000);
        return () => { clearTimeout(first); clearInterval(id); };
    }, []);

    if (teams.length === 0) return null;
    const current = teams[Math.min(active, teams.length - 1)];

    // arrow keys move between tabs, as expected from a tab list
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const next = (active + (e.key === "ArrowRight" ? 1 : -1) + teams.length) % teams.length;
        setActive(next);
        document.getElementById(`next-tab-${teams[next].team}`)?.focus();
    };

    return (
        <section aria-labelledby="prossime-partite">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <h2 id="prossime-partite" className="font-display text-3xl font-bold uppercase tracking-tight text-virtus-blue">
                    Prossime partite
                </h2>
                {teams.length > 1 && (
                    <div role="tablist" aria-label="Scegli la squadra" className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
                        {teams.map((t, i) => (
                            <button
                                key={t.team}
                                id={`next-tab-${t.team}`}
                                role="tab"
                                type="button"
                                aria-selected={i === active}
                                aria-controls={`next-panel-${t.team}`}
                                tabIndex={i === active ? 0 : -1}
                                onClick={() => setActive(i)}
                                className={`rounded-full border px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${i === active ? "border-virtus-blue bg-virtus-blue text-white shadow-md" : "border-gray-200 bg-white text-gray-500 hover:border-virtus-yellow hover:text-virtus-blue"}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div role="tabpanel" id={`next-panel-${current.team}`} aria-labelledby={`next-tab-${current.team}`}>
                <MatchCard team={current} now={now} />
            </div>
        </section>
    );
}
