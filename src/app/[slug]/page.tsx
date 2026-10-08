import { getPageContent, getAllPages } from '@/lib/content';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';
import Image from 'next/image';
import StandingsWidget from '@/components/StandingsWidget';
import CalendarWidget from '@/components/CalendarWidget';
import ContactForm from '@/components/ContactForm';
import SponsorsWidget from '@/components/SponsorsWidget';
import { getAllStandings, getAllMatches, getSponsors } from '@/lib/content';
import type { StandingRow } from '@/components/StandingsWidget';
import type { CalendarEvent } from '@/components/CalendarWidget';

type Person = Record<string, string | undefined>;


export async function generateStaticParams() {
    const pages = getAllPages();
    return pages.map((page) => ({
        slug: page?.slug,
    })).filter(p => p.slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const page = getPageContent(slug);

    if (!page) {
        return {
            title: 'Pagina Non Trovata',
        };
    }

    return {
        title: /virtus velletri/i.test(page.meta.title) ? { absolute: page.meta.title } : page.meta.title,
        description: page.meta.description || 'Virtus Velletri Basket',
        alternates: { canonical: `/${slug}` },
        openGraph: { title: page.meta.title, description: page.meta.description, url: `/${slug}`, images: page.meta.heroImage ? [page.meta.heroImage] : undefined },
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = getPageContent(slug);
    const sponsors = getSponsors();

    if (!page) {
        notFound();
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header with Hero Image Background */}
            <div className="relative pt-24 pb-8 md:pt-28 md:pb-10 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={page.meta.heroImage || "/images/hero.png"}
                        alt={page.meta.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-virtus-blue/80"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 text-white tracking-tight">
                        {page.meta.title}
                    </h1>
                    {page.meta.description && (
                        <p className={`text-base md:text-lg mx-auto font-medium ${page.meta.category === 'Minibasket' || slug === 'news'
                            ? 'text-white text-justify leading-relaxed italic max-w-3xl'
                            : 'text-white max-w-2xl text-center'
                            }`}>
                            {page.meta.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Content, Roster, Staff */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Main Content (Markdown) */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
                            <article className={`prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:text-virtus-blue prose-a:text-virtus-blue prose-img:rounded-xl prose-img:shadow-md prose-strong:text-virtus-blue ${slug === 'contatti' ? 'prose-hr:border-virtus-yellow prose-hr:border-2 prose-hr:mt-2 prose-hr:mb-8 !prose-a:no-underline' : 'hover:prose-a:text-yellow-600'}`}>
                                <ReactMarkdown>{page.content}</ReactMarkdown>
                            </article>
                            {slug === 'contatti' && <ContactForm />}
                            {slug === 'diventa-sponsor' && <ContactForm variant="sponsor" />}
                        </div>

                        {/* Dynamic Roster Section */}
                        {page.meta.roster && (page.meta.roster as Person[]).length > 0 && (
                            <div>
                                <h2 className="text-3xl font-display font-bold text-virtus-blue uppercase tracking-tight mb-6 flex items-center">
                                    <span className="w-2 h-8 bg-virtus-yellow mr-4"></span>
                                    {page.meta.category === 'Minibasket' ? 'Miniatleti' : 'Roster'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {(page.meta.roster as Person[]).map((player, index: number) => {
                                        const playerNum = parseInt(player.number ?? '') || 0;
                                        const isEven = playerNum % 2 === 0;
                                        const numTextColor = 'text-virtus-blue';

                                        return (
                                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow border border-gray-100 h-48">
                                                <div className="flex h-full">
                                                    <div className="w-1/2 bg-gray-50 relative h-full border-r border-gray-50 overflow-hidden">
                                                        {player.image ? (
                                                            <Image
                                                                src={player.image}
                                                                alt={player.name ?? ''}
                                                                fill
                                                                className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold text-4xl opacity-50">
                                                                #{player.number || '0'}
                                                            </div>
                                                        )}
                                                        {player.number && (
                                                            <div className={`absolute top-1 left-1 font-black text-2xl z-20 drop-shadow-md ${numTextColor}`}>
                                                                #{player.number}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="w-1/2 p-4 flex flex-col justify-between">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div className="min-w-0 flex-1 overflow-visible">
                                                                <h3 className="font-bold text-base md:text-lg text-virtus-blue uppercase leading-tight group-hover:text-virtus-yellow transition-colors break-words">
                                                                    {player.name}
                                                                </h3>
                                                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tight">{player.position}</p>
                                                            </div>
                                                        </div>
                                                        {(player.height || player.year) && (
                                                            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[10px]">
                                                                {player.height && (
                                                                    <div>
                                                                        <span className="text-gray-400 block uppercase text-[8px]">Altezza</span>
                                                                        <span className="font-bold text-gray-700">{player.height}</span>
                                                                    </div>
                                                                )}
                                                                {player.year && (
                                                                    <div>
                                                                        <span className="text-gray-400 block uppercase text-[8px]">Anno</span>
                                                                        <span className="font-bold text-gray-700">{player.year}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Dynamic Staff Section */}
                        {page.meta.staff && (page.meta.staff as Person[]).length > 0 && (
                            <div>
                                <h2 className="text-3xl font-display font-bold text-virtus-blue uppercase tracking-tight mb-6 flex items-center">
                                    <span className="w-2 h-8 bg-virtus-yellow mr-4"></span>
                                    Staff Tecnico
                                </h2>
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {(page.meta.staff as Person[]).map((member, index: number) => (
                                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="relative w-16 h-16 shrink-0 bg-virtus-blue text-white rounded-full flex items-center justify-center font-bold text-xl overflow-hidden">
                                                    {member.image ? (
                                                        <Image src={member.image} alt={member.name ?? ''} fill className="object-cover object-top" />
                                                    ) : (
                                                        (member.name ?? '').charAt(0)
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-virtus-yellow uppercase tracking-wider">{member.role}</div>
                                                    <div className="font-bold text-lg text-gray-800">{member.name}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Widgets */}
                    <div className="space-y-12">
                        {/* Sponsors Widget */}
                        <SponsorsWidget sponsors={sponsors} />

                        {/* Standings Widget */}
                        {(() => {
                            if (page.meta.category === 'Minibasket') return null;

                            // Filter standings for this specific page
                            const allStandings = getAllStandings();
                            const pageStandings = allStandings.filter((s) =>
                                s.team_slug === slug ||
                                (s.team_slug && slug.includes(s.team_slug)) ||
                                (s.team_slug && s.team_slug.includes(slug))
                            );

                            if (pageStandings.length > 0) {
                                return <StandingsWidget groups={pageStandings} />;
                            } else if (page.meta.standings && (page.meta.standings as StandingRow[]).length > 0) {
                                return <StandingsWidget standings={page.meta.standings as StandingRow[]} />;
                            }
                            return null;
                        })()}

                        {/* Calendar Widget */}
                        {(() => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const allMatches = getAllMatches();

                            const teamMatches = allMatches.filter((e) =>
                                e.teamId === slug ||
                                (e.teamId && slug.includes(e.teamId)) ||
                                (e.teamId && e.teamId.includes(slug))
                            );
                            // /calendario/<slug> exists only for teams with matches
                            const hasCalendar = teamMatches.length > 0;

                            const pageEvents = teamMatches
                                .filter((e) => new Date(e.date) >= today)
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .slice(0, 5);

                            if (pageEvents.length > 0) {
                                return <CalendarWidget events={pageEvents} teamSlug={slug} showCalendarLink={hasCalendar} />;
                            } else if (page.meta.calendar && (page.meta.calendar as CalendarEvent[]).length > 0) {
                                const calendarItems = (page.meta.calendar as CalendarEvent[])
                                    .filter((e) => new Date(e.date) >= today)
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                    .slice(0, 5);
                                return <CalendarWidget events={calendarItems} teamSlug={slug} showCalendarLink={hasCalendar} />;
                            } else if (page.meta.category === 'Minibasket') {
                                return <CalendarWidget events={[]} teamSlug={slug} showCalendarLink={hasCalendar} />;
                            }
                            return null;
                        })()}
                    </div>

                </div>
            </div>
        </div>
    );
}
