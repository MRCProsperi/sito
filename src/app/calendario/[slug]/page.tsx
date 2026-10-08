import type { Metadata } from 'next';
import { SEASON } from '@/lib/site';
import { getAllMatches, getAllPages, getPageContent } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, ChevronRight, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import fs from 'node:fs';
import CalendarSubscribe from '@/components/CalendarSubscribe';

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
                    className="inline-flex items-center text-virtus-blue hover:text-virtus-yellow mb-8 font-bold transition-colors group"
                >
                    <MoveLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Torna alla squadra
                </Link>

                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-display font-black text-virtus-blue uppercase tracking-tight mb-2">
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

                        return (
                            <Link
                                href={`/partite/${match.slug}`}
                                key={index}
                                className="block bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 group hover:-translate-y-1 active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Date Circle */}
                                    <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors leading-none">
                                        <span className="text-[10px] md:text-xs font-black text-virtus-yellow mb-1">{weekday}</span>
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
                                                <Clock className="w-4 h-4 text-virtus-yellow" />
                                                {match.time || 'TBD'}
                                            </div>
                                            <div className="flex items-center gap-1 min-w-0">
                                                <MapPin className="w-4 h-4 text-virtus-yellow shrink-0" />
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
