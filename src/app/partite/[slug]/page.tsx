import type { Metadata } from 'next';
import { getMatchBySlug, getAllMatches } from '@/lib/content';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, Navigation, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export async function generateStaticParams() {
    const matches = getAllMatches();
    // A static export needs at least one path: with no matches yet (start of season) a placeholder is generated and renders 404
    if (matches.length === 0) return [{ slug: 'nessuna-partita' }];
    return matches.map((match) => ({
        slug: match.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const match = getMatchBySlug(slug);
    if (!match) return { title: 'Partita non trovata' };
    const when = new Date(match.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
    return {
        title: `${match.title} - ${when}`,
        description: `${match.title}${match.category ? ` (${match.category})` : ''}, ${when}${match.time ? ` ore ${match.time}` : ''}${match.location ? `, ${match.location}` : ''}.`,
        alternates: { canonical: `/partite/${slug}` },
    };
}

export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const match = getMatchBySlug(slug);

    if (!match) {
        notFound();
    }

    const players = match.players ?? [];
    const hasBoxscore = players.length > 0;
    const totalPoints = players.reduce((sum, p) => sum + (Number(p.points) || 0), 0);
    const [homeTeam = '', awayTeam = ''] = match.title.split(/\s+vs\.?\s+/i);
    const parsePairs = (text?: string) => (text || '').split(/[,;]/).map((t) => t.trim().match(/^(\d+)\s*-\s*(\d+)$/)).filter((m): m is RegExpMatchArray => !!m).map((m) => [Number(m[1]), Number(m[2])]);
    const quarterPairs = parsePairs(match.quarters);
    const finalPair = parsePairs(match.score)[0];
    const hasStarters = players.some((p) => p.starter);
    const starters = players.filter((p) => p.starter);
    const bench = players.filter((p) => !p.starter);
    const groups = hasStarters ? [{ label: 'Quintetto', rows: starters }, { label: 'Panchina', rows: bench }] : [{ label: '', rows: players }];
    const mapsUrl =`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.location || '')}`;

    // Format date in Italian
    const dateObj = new Date(match.date);
    const formattedDate = dateObj.toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* Back Button */}
                <Link
                    href={`/${match.teamId}`}
                    className="inline-flex items-center text-virtus-blue hover:text-virtus-gold mb-8 font-bold transition-colors group"
                >
                    <MoveLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Torna alla squadra
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-virtus-blue p-8 md:p-12 text-center text-white relative">
                        <div className="absolute top-4 right-4 bg-virtus-yellow text-virtus-blue px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                            {match.category}
                        </div>
                        <h1 className="text-2xl md:text-4xl font-display font-black uppercase mb-2">
                            {match.title}
                        </h1>
                        {match.score && (
                            <div className="mt-4 flex flex-col items-center">
                                <div className="text-[10px] font-black uppercase tracking-widest text-virtus-yellow opacity-80 mb-1">Risultato Finale</div>
                                <div className="text-4xl md:text-6xl font-display font-black tracking-tighter text-virtus-yellow drop-shadow-lg">
                                    {match.score}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details Grid */}
                    <div className="p-8 md:p-12">
                        {!hasBoxscore && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* Left: Info */}
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-virtus-blue shrink-0">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Data</div>
                                        <div className="text-lg font-bold text-gray-800 capitalize">{formattedDate}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-virtus-blue shrink-0">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ora</div>
                                        <div className="text-lg font-bold text-gray-800">{match.time || 'TBD'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Location */}
                            {!hasBoxscore && (
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-virtus-blue shrink-0">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Campo da Gioco</div>
                                            <div className="text-lg font-bold text-gray-800 mb-4 leading-snug">
                                                {match.location}
                                            </div>

                                            <a
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center bg-virtus-yellow hover:bg-yellow-400 text-virtus-blue px-6 py-3 rounded-xl font-black uppercase tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95"
                                            >
                                                <Navigation className="w-5 h-5 mr-2" />
                                                Apri in Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                        )}

                        {hasBoxscore && (
                            <div>
                                <h2 className="text-2xl font-display font-black uppercase text-virtus-blue mb-6">Tabellino</h2>

                                {quarterPairs.length > 0 && homeTeam && awayTeam && (
                                    <div className="mb-8 overflow-x-auto">
                                        <table className="w-full text-center">
                                            <thead>
                                                <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                                    <th className="py-2 text-left">Squadra</th>
                                                    {quarterPairs.map((_, i) => <th key={i} className="py-2 px-2">Q{i + 1}</th>)}
                                                    <th className="py-2 pl-3 text-virtus-blue">Tot</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[homeTeam, awayTeam].map((team, side) => (
                                                    <tr key={team} className="border-b border-gray-100">
                                                        <td className="py-2.5 text-left font-bold text-gray-800">{team}</td>
                                                        {quarterPairs.map((q, i) => <td key={i} className="py-2.5 px-2 text-gray-700">{q[side]}</td>)}
                                                        <td className="py-2.5 pl-3 font-display font-black text-virtus-blue">
                                                            {finalPair ? finalPair[side] : quarterPairs.reduce((sum, q) => sum + q[side], 0)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <div className="mb-3 text-sm font-black uppercase tracking-widest text-virtus-blue">{homeTeam.toLowerCase().includes('virtus') ? homeTeam : awayTeam.toLowerCase().includes('virtus') ? awayTeam : 'Virtus Velletri'}</div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                            <th className="py-2">Giocatore</th>
                                            <th className="py-2 text-right">Punti</th>
                                        </tr>
                                    </thead>
                                    {groups.map((g) => (
                                        <tbody key={g.label || 'tutti'}>
                                            {g.label && g.rows.length > 0 && (
                                                <tr className="bg-gray-50">
                                                    <th colSpan={2} className="py-1.5 px-2 text-left text-[11px] font-black uppercase tracking-widest text-gray-500">{g.label}</th>
                                                </tr>
                                            )}
                                            {g.rows.map((p, i) => (
                                                <tr key={i} className="border-b border-gray-100">
                                                    <td className="py-2.5 font-bold text-gray-800">
                                                        {p.name}
                                                        {p.number != null && p.number !== '' && (
                                                            <span className="ml-1.5 text-xs font-semibold text-gray-400">#{p.number}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 text-right font-display font-black text-gray-800">{p.points}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    ))}
                                    <tfoot>
                                        <tr className="border-t-2 border-virtus-blue">
                                            <td className="py-3 text-xs font-black uppercase tracking-widest text-virtus-blue">Totale</td>
                                            <td className="py-3 text-right font-display font-black text-virtus-blue">{totalPoints}</td>
                                        </tr>
                                    </tfoot>
                                </table>

                                {(match.coach || match.assistantCoach || (match.officials && match.officials.length > 0)) && (
                                    <dl className="mt-6 space-y-2 text-gray-800">
                                        {match.coach && (
                                            <div>
                                                <dt className="inline text-xs font-bold uppercase tracking-widest text-gray-400">Allenatore</dt>{' '}
                                                <dd className="inline font-bold">{match.coach}</dd>
                                            </div>
                                        )}
                                        {match.assistantCoach && (
                                            <div>
                                                <dt className="inline text-xs font-bold uppercase tracking-widest text-gray-400">Vice allenatore</dt>{' '}
                                                <dd className="inline font-bold">{match.assistantCoach}</dd>
                                            </div>
                                        )}
                                        {match.officials && match.officials.length > 0 && (
                                            <div>
                                                <dt className="inline text-xs font-bold uppercase tracking-widest text-gray-400">Dirigenti</dt>{' '}
                                                <dd className="inline font-bold">{match.officials.join(', ')}</dd>
                                            </div>
                                        )}
                                    </dl>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
