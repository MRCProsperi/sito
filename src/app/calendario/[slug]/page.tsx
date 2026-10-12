import type { Metadata } from 'next';
import { SEASON } from '@/lib/site';
import { getAllMatches, getAllPages, getPageContent } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, ChevronRight, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import fs from 'node:fs';
import CalendarSubscribe from '@/components/CalendarSubscribe';


// Outcome for Virtus from a "Home vs Away" title and a "home-away" score: 'V' win, 'P' loss, 'N' draw, null if unknown.
function outcome(title: string, score?: string): 'V' | 'P' | 'N' | null {
    const m = (score || '').match(/^(\d+)\s*-\s*(\d+)$/);
    const [home = '', away = ''] = title.split(/\s+vs\.?\s+/i);
    if (!m || !home || !away) return null;
    const [h, a] = [Number(m[1]), Number(m[2])];
    const virtusHome = home.toLowerCase().includes('virtus');
    const virtusAway = away.toLowerCase().includes('virtus');
    if (virtusHome === virtusAway) return null;
    if (h === a) return 'N';
    return (h > a) === virtusHome ? 'V' : 'P';
}

export async function generateStaticParams() {
    const pages = getAllPages();
    return pages.map((page) => ({
        slug: page?.slug,
    })).filter(p => p.slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const page = getPageContent(slug);
    if (!page) return { title: 'Calendario non trovato' };
    return {
        title: `Calendario ${page.meta.title}`,
        description: `Calendario delle partite ${page.meta.title} della Virtus Velletri.`,
        alternates: { canonical: `/calendario/${slug}` },
    };
}

export default async function CalendarPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const allMatches = getAllMatches();

    // Filter matches for this team
    const teamMatches = allMatches
        .filter((e) =>
            e.teamId === slug ||
            (e.teamId && slug.includes(e.teamId)) ||
            (e.teamId && e.teamId.includes(slug))
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (teamMatches.length === 0) {
        notFound();
    }

    const teamIcs = fs.existsSync(`public/calendari/${slug}.ics`) ? slug : null;

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* Back Button */}
                <Link
                    href={`/${slug}`}
                    className="inline-flex items-center text-virtus-blue hover:text-virtus-gold mb-8 font-bold transition-colors group"
                >
                    <MoveLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Torna alla squadra
                </Link>

                <div className="mb-10 text-center">
                    <h1 className="page-title mb-2">
                        Calendario Completo
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                        Stagione {SEASON}
                    </p>
                </div>

                {teamIcs && (
                    <div className="mb-8">
                        <CalendarSubscribe team={teamIcs} label={slug.toUpperCase()} />
                    </div>
                )}

                <div className="space-y-4">
                    {teamMatches.map((match, index) => {
                        const dateObj = new Date(match.date);
                        const day = dateObj.getDate().toString().padStart(2, '0');
                        const month = dateObj.toLocaleString('it-IT', { month: 'short' }).toUpperCase().replace('.', '');
                        const weekday = dateObj.toLocaleString('it-IT', { weekday: 'short' }).toUpperCase();

                        const result = outcome(match.title, match.score);
                        if (match.score) {
                            const [homeScore, awayScore] = match.score.split('-').map((n) => n.trim());
                            const tone = result === 'V' ? { bar: 'bg-green-500', badge: 'bg-green-100 text-green-700', text: 'text-green-700', label: 'Vittoria' }
                                : result === 'P' ? { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700', text: 'text-red-700', label: 'Sconfitta' }
                                : { bar: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600', text: 'text-gray-700', label: 'Finale' };
                            return (
                                <Link
                                    href={`/partite/${match.slug}`}
                                    key={index}
                                    className="relative block overflow-hidden bg-white rounded-2xl pl-5 pr-4 py-4 md:pl-7 md:pr-6 md:py-5 shadow-sm hover:shadow-lg transition-all border border-gray-100 group hover:-translate-y-0.5 active:scale-[0.98]"
                                >
                                    <span className={`absolute inset-y-0 left-0 w-1.5 ${tone.bar}`} aria-hidden="true" />
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <div className="flex-shrink-0 w-14 text-center leading-none">
                                            <div className="text-[10px] font-black text-gray-400">{weekday}</div>
                                            <div className="text-2xl font-black text-gray-700 my-1">{day}</div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase">{month}</div>
                                        </div>

                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-white bg-virtus-blue px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    {match.category}
                                                </span>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${tone.badge}`}>
                                                    {tone.label}
                                                </span>
                                            </div>
                                            <h2 className="text-base md:text-lg font-display font-black text-gray-800 uppercase leading-snug group-hover:text-virtus-blue transition-colors">
                                                {match.title}
                                            </h2>
                                            <div className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-virtus-blue transition-colors">
                                                Vedi il tabellino
                                            </div>
                                        </div>

                                        <div className={`flex-shrink-0 text-right font-display font-black leading-none ${tone.text}`}>
                                            <span className="text-3xl md:text-4xl">{homeScore}</span>
                                            <span className="mx-1 text-xl text-gray-300">-</span>
                                            <span className="text-3xl md:text-4xl">{awayScore}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                href={`/partite/${match.slug}`}
                                key={index}
                                className="block bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group hover:-translate-y-1 active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Date Circle */}
                                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors leading-none">
                                        <span className="text-[10px] md:text-xs font-black text-virtus-gold mb-1">{weekday}</span>
                                        <span className="text-2xl md:text-3xl font-black text-gray-800">{day}</span>
                                        <span className="text-[10px] md:text-xs font-black text-virtus-blue mt-1 uppercase">{month}</span>
                                    </div>

                                    {/* Match Info */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-white bg-virtus-blue px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                {match.category}
                                            </span>
                                            {new Date(match.date) < new Date() && (
                                                <span className="text-[10px] font-black text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    Giocata
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-lg md:text-xl font-display font-black text-gray-800 uppercase leading-snug truncate group-hover:text-virtus-blue transition-colors">
                                            {match.title}
                                        </h2>
                                        {match.score && (
                                            <div className="mt-1 text-xl font-display font-black text-virtus-blue">
                                                {match.score}
                                            </div>
                                        )}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs md:text-sm text-gray-500 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4 text-virtus-gold" />
                                                {match.time || 'TBD'}
                                            </div>
                                            <div className="flex items-center gap-1 min-w-0">
                                                <MapPin className="w-4 h-4 text-virtus-gold shrink-0" />
                                                <span className="truncate">{match.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="hidden sm:block text-gray-300 group-hover:text-virtus-blue transition-colors">
                                        <ChevronRight className="w-8 h-8" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
