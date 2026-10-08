import type { Metadata } from "next";
import BentoGrid from "@/components/BentoGrid";
import InstagramGrid from "@/components/InstagramGrid";
import NewsTicker from "@/components/NewsTicker";
import Link from "next/link";
import Image from "next/image";
import CalendarWidget from "@/components/CalendarWidget";
import NextMatch, { type TeamMatches } from "@/components/NextMatch";
import LatestNews from "@/components/LatestNews";
import Reveal from "@/components/Reveal";
import { romeTimestamp } from "@/lib/time";
import StandingsWidget from "@/components/StandingsWidget";
import SponsorsWidget from "@/components/SponsorsWidget";
import HorizontalSponsorCarousel from "@/components/HorizontalSponsorCarousel";
import { getAllStandings, getAllMatches, getAllNews, getSponsors } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Virtus Velletri Basket | Basket e Minibasket a Velletri" },
  description: "Società di pallacanestro di Velletri: squadre senior, settore giovanile e minibasket. Calendari, classifiche, news e iscrizioni.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const allStandings = getAllStandings();
  const sponsors = getSponsors();
  const latestNews = getAllNews()
    .filter((n) => n.meta.featured !== false)
    .slice(0, 4)
    .map((n, i: number) => ({
      id: i,
      text: n.meta.title,
      link: `/news/${n.slug}`
    }));

  // Filter and sort all matches by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMatches = getAllMatches()
    .filter(match => new Date(match.date) >= today)
    .sort((a, b) => romeTimestamp(a.date, a.time) - romeTimestamp(b.date, b.time))
    .slice(0, 5);

  // One card per team that has a calendar: its next matches, the browser picks the right one
  const teamCards = Object.values(
    getAllMatches()
      .filter((m) => m.teamId && new Date(m.date) >= today)
      .sort((a, b) => romeTimestamp(a.date, a.time) - romeTimestamp(b.date, b.time))
      .reduce<Record<string, TeamMatches>>((acc, m) => {
        const key = m.teamId as string;
        (acc[key] ??= { team: key, label: m.category || key.toUpperCase(), matches: [] }).matches.push(m);
        return acc;
      }, {})
  )
    .map((t) => ({ ...t, matches: t.matches.slice(0, 4) }))
    .sort((a, b) => romeTimestamp(a.matches[0].date, a.matches[0].time) - romeTimestamp(b.matches[0].date, b.matches[0].time));

  const newsCards = getAllNews()
    .slice(0, 3)
    .map((n) => ({
      slug: n.slug,
      title: String(n.meta.title),
      date: String(n.meta.date),
      description: n.meta.description ? String(n.meta.description) : undefined,
      image: n.meta.image ? String(n.meta.image) : undefined,
      category: n.meta.category ? String(n.meta.category) : undefined,
    }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Compact Hero */}
      <section className="relative h-[40vh] w-full flex items-center justify-center overflow-hidden bg-virtus-blue">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero.png"
            alt="Virtus Velletri Action"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-virtus-blue via-virtus-blue/50 to-transparent z-10"></div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <h1 className="animate-fade-up text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-tighter leading-none mb-4">
            Virtus <span className="text-virtus-yellow">Velletri</span>
          </h1>
          <p className="animate-fade-up-delay text-lg md:text-xl text-gray-200">
            Il basket nel cuore dei Castelli Romani
          </p>
        </div>
      </section>

      {/* News Ticker */}
      <NewsTicker news={latestNews} />

      {/* Next matches: one card per team with a calendar */}
      {teamCards.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 w-full">
          <Reveal><NextMatch teams={teamCards} /></Reveal>
        </div>
      )}

      {/* Latest news */}
      {newsCards.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 w-full">
          <Reveal><LatestNews items={newsCards} /></Reveal>
        </div>
      )}

      {/* NBA Style Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Bento Grid - Il Mondo Virtus */}
            <div>
              <h2 className="section-title mb-6">
                Il Mondo Virtus
              </h2>
              <Reveal><BentoGrid compact={true} /></Reveal>
            </div>

            {/* Horizontal Timed Sponsor Carousel */}
            <section className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="widget-title mb-4 pb-2 border-b-2 border-virtus-yellow">
                I Nostri Partner
              </h3>
              <HorizontalSponsorCarousel sponsors={sponsors} />
            </section>

            {/* Instagram Feed */}
            <section>
              <h2 className="section-title mb-6">
                Ultimi Post Instagram
              </h2>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <InstagramGrid />
              </div>
            </section>

          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-8">

            {/* Vertical Sponsor Carousel */}
            <Reveal><SponsorsWidget sponsors={sponsors} /></Reveal>

            {/* Social Links */}

            {/* Social Links */}
            <section className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="widget-title mb-4 pb-2 border-b-2 border-virtus-yellow">
                Social
              </h3>
              <div className="space-y-4">
                <a href="https://www.facebook.com/virtusvelletribasket/" target="_blank" rel="noopener noreferrer" className="block p-4 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <div>
                      <div className="font-bold text-sm">Facebook</div>
                      <div className="text-xs opacity-80">Seguici</div>
                    </div>
                  </div>
                </a>

                <a href="https://www.instagram.com/virtusvelletri_bk/" target="_blank" rel="noopener noreferrer" className="block p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <div>
                      <div className="font-bold text-sm">Instagram</div>
                      <div className="text-xs opacity-80">Seguici</div>
                    </div>
                  </div>
                </a>
              </div>
            </section>

            {/* Calendar Widget */}
            <CalendarWidget events={upcomingMatches} title="Risultati e Calendario" />

            {/* Standings Widget */}
            <Reveal><StandingsWidget groups={allStandings} /></Reveal>

          </div>
        </div>
      </div>


    </div>
  );
}
