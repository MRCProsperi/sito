"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface StandingRow {
    rank: number;
    team: string;
    points: number;
    played?: number;
    won?: number;
    lost?: number;
}

interface StandingsWidgetProps {
    standings?: StandingRow[];
    title?: string;
    groups?: { title: string; data: StandingRow[] }[]; // Support for multiple groups
}

export default function StandingsWidget({ standings, title = "Classifica", groups }: StandingsWidgetProps) {
    // Normalize input to groups
    const allGroups = groups || (standings ? [{ title, data: standings }] : []);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (allGroups.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % allGroups.length);
        }, 5000); // 5 seconds rotation

        return () => clearInterval(interval);
    }, [allGroups.length]);

    if (allGroups.length === 0) {
        return null;
    }

    const currentGroup = allGroups[currentIndex];

    // Sort by points desc, then rank asc
    const sortedStandings = [...currentGroup.data].sort((a, b) => b.points - a.points || a.rank - b.rank);

    // Limit to 5 teams, centered on Virtus Velletri if possible
    let displayStandings = sortedStandings;
    if (sortedStandings.length > 5) {
        const virtusIndex = sortedStandings.findIndex(row =>
            row.team.toLowerCase().includes("virtus velletri")
        );

        if (virtusIndex !== -1) {
            let start = Math.max(0, virtusIndex - 2);
            const end = Math.min(sortedStandings.length, start + 5);

            // Adjust start if we hit the end
            if (end - start < 5) {
                start = Math.max(0, end - 5);
            }

            displayStandings = sortedStandings.slice(start, end);
        } else {
            displayStandings = sortedStandings.slice(0, 5);
        }
    }

    return (
        <section className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-8 min-h-[400px]">
            {/* Header */}
            <div className="bg-virtus-blue p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-virtus-yellow" />
                    <h3 className="text-xl font-display font-bold uppercase tracking-tight">
                        {currentGroup.title}
                    </h3>
                </div>
                {allGroups.length > 1 && (
                    <div className="flex gap-1">
                        {allGroups.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-virtus-yellow' : 'bg-white/30'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="p-4 relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-x-auto"
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-gray-100 text-gray-500">
                                    <th className="py-2 text-left w-12">Pos</th>
                                    <th className="py-2 text-left">Squadra</th>
                                    <th className="py-2 text-center w-12">PT</th>
                                    <th className="py-2 text-center w-12 hidden sm:table-cell">G</th>
                                    <th className="py-2 text-center w-12 hidden sm:table-cell">V</th>
                                    <th className="py-2 text-center w-12 hidden sm:table-cell">P</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayStandings.map((row) => { // Key logic moved to ensure uniqueness if needed, but index is fine here within the isolated table
                                    const isVirtus = row.team.toLowerCase().includes("virtus");
                                    return (
                                        <tr
                                            key={`${row.team}-${row.rank}`}
                                            className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${isVirtus ? 'bg-blue-50' : ''}`}
                                        >
                                            <td className="py-3 font-bold text-gray-400">
                                                <span className={`flex items-center justify-center w-6 h-6 rounded-full ${row.rank <= 3 ? 'bg-virtus-yellow text-virtus-blue' : ''}`}>
                                                    {row.rank}
                                                </span>
                                            </td>
                                            <td className={`py-3 font-bold ${isVirtus ? 'text-virtus-blue' : 'text-gray-700'}`}>
                                                {row.team}
                                            </td>
                                            <td className="py-3 text-center font-bold text-virtus-blue">{row.points}</td>
                                            <td className="py-3 text-center text-gray-600 hidden sm:table-cell">{row.played || '-'}</td>
                                            <td className="py-3 text-center text-green-600 hidden sm:table-cell">{row.won || '-'}</td>
                                            <td className="py-3 text-center text-red-500 hidden sm:table-cell">{row.lost || '-'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
