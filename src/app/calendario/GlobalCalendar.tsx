"use client";

import { SEASON } from "@/lib/site";
import { useState, useMemo } from 'react';
import { MatchEvent } from '@/lib/content';
import { Clock, MapPin, ChevronRight, MoveLeft } from 'lucide-react';
import Link from 'next/link';
import CalendarSubscribe from '@/components/CalendarSubscribe';

// Helper to group by month
const groupByMonth = (matches: MatchEvent[]) => {
    return matches.reduce((acc, match) => {
        const date = new Date(match.date);
        const monthYear = date.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(match);
        return acc;
    }, {} as Record<string, MatchEvent[]>);
};

export default function GlobalCalendar({ initialMatches }: { initialMatches: MatchEvent[] }) {
    const [activeTab, setActiveTab] = useState('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'played'>('all');

    const tabs = [
        { id: 'all', label: 'Tutte' },
        { id: 'dr1', label: 'DR1' },
        { id: 'youth', label: 'Giovanili' },
        { id: 'amatoriale', label: 'Amatoriale' },
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredMatches = useMemo(() => {
        let filtered = initialMatches;

        // Category Filter
        if (activeTab === 'dr1') filtered = initialMatches.filter(m => m.teamId === 'dr1');
        else if (activeTab === 'youth') filtered = initialMatches.filter(m => m.teamId?.startsWith('under-'));
        else if (activeTab === 'amatoriale') filtered = initialMatches.filter(m => m.teamId === 'amatoriale');

        // Status Filter
        if (statusFilter === 'upcoming') {
            filtered = filtered.filter(m => new Date(m.date) >= today);
        } else if (statusFilter === 'played') {
            filtered = filtered.filter(m => new Date(m.date) < today);
        }

        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [activeTab, statusFilter, initialMatches, today]);

    const groupedMatches = useMemo(() => groupByMonth(filteredMatches), [filteredMatches]);

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Header Section */}
                <div className="flex flex-col mb-8 gap-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <Link
                                href="/"
                                className="inline-flex items-center text-virtus-blue hover:text-virtus-gold mb-4 font-bold transition-colors group"
                            >
                                <MoveLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                                Torna alla Home
                            </Link>
                            <h1 className="page-title mb-1">
                                Calendario <span className="text-virtus-gold">Globale</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                                Stagione {SEASON} • {filteredMatches.length} Gare
                            </p>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-sm border ${activeTab === tab.id
                                            ? 'bg-virtus-blue text-white border-virtus-blue'
                                            : 'bg-white text-gray-500 border-gray-100 hover:border-virtus-yellow'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <CalendarSubscribe team={activeTab === 'dr1' ? 'dr1' : 'tutte-le-squadre'} label={activeTab === 'dr1' ? 'DR1' : 'Tutte le squadre'} />

                    {/* Status Toggle / Shortcuts */}
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 self-start">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${statusFilter === 'all' ? 'bg-gray-100 text-virtus-blue' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            Tutte
                        </button>
                        <button
                            onClick={() => setStatusFilter('upcoming')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${statusFilter === 'upcoming' ? 'bg-virtus-yellow/10 text-virtus-gold' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            Da Giocare
                        </button>
                        <button
                            onClick={() => setStatusFilter('played')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${statusFilter === 'played' ? 'bg-virtus-blue/10 text-virtus-blue' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            Risultati
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {Object.keys(groupedMatches).length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                            <p className="text-gray-400 font-bold uppercase tracking-widest italic">Nessuna gara trovata per questi filtri</p>
                        </div>
                    ) : (
                        Object.entries(groupedMatches).map(([month, matches]) => (
                            <div key={month} className="relative">
                                {/* Month Header */}
                                <div className="sticky top-20 z-10 bg-gray-50/95 backdrop-blur-sm py-2 mb-4">
                                    <h2 className="text-xl font-display font-black text-virtus-blue uppercase border-l-4 border-virtus-yellow pl-3">
                                        {month}
                                    </h2>
                                </div>

                                {/* Match List (2 Column Grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    {matches.map((match, idx) => {
                                        const dateObj = new Date(match.date);
                                        const day = dateObj.getDate().toString().padStart(2, '0');
                                        const weekday = dateObj.toLocaleString('it-IT', { weekday: 'short' }).toUpperCase();
                                        const isPast = dateObj < today;

                                        return (
                                            <Link
                                                key={idx}
                                                href={`/partite/${match.slug}`}
                                                className={`group flex items-center bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all border-2 ${isPast ? 'border-gray-50 opacity-90' : 'border-white hover:border-virtus-yellow/30'}`}
                                            >
                                                {/* Date Info */}
                                                <div className="flex flex-shrink-0 flex-col items-center justify-center w-12 md:w-16 border-r border-gray-100 pr-3 md:pr-4">
                                                    <span className="text-[10px] font-black text-gray-400 leading-none mb-1">{weekday}</span>
                                                    <span className="text-xl md:text-2xl font-black text-virtus-blue leading-none">{day}</span>
                                                </div>

                                                {/* Match Details */}
                                                <div className="flex-grow pl-3 md:pl-4 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${match.category?.includes('DR1') ? 'bg-virtus-blue text-virtus-yellow border border-virtus-yellow/30' :
                                                                match.category?.includes('Amatoriale') ? 'bg-virtus-blue text-white' :
                                                                    match.category?.includes('Under') ? 'bg-virtus-yellow text-virtus-blue' :
                                                                        'bg-gray-800 text-white'
                                                            }`}>
                                                            {match.category}
                                                        </span>
                                                        {isPast && (
                                                            <span className="text-[9px] md:text-[10px] font-black px-2 py-0.5 bg-gray-100 text-gray-400 rounded-md uppercase tracking-tighter">
                                                                Finita
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-virtus-blue transition-colors truncate">
                                                        {match.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1 text-[10px] md:text-xs text-gray-400 font-medium whitespace-nowrap overflow-hidden">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-virtus-gold" /> {match.time || 'TBD'}</span>
                                                        <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 text-virtus-gold" /> {match.location}</span>
                                                    </div>
                                                </div>

                                                {/* Score / Arrow */}
                                                <div className="flex flex-shrink-0 items-center gap-2 pl-2">
                                                    {match.score ? (
                                                        <div className="text-base md:text-lg font-display font-black text-virtus-blue bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                                            {match.score}
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-virtus-blue group-hover:text-white transition-colors">
                                                            <ChevronRight className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
