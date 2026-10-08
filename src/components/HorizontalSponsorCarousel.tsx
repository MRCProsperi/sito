"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Sponsor {
    name: string;
    logo: string;
    url?: string;
}

export default function HorizontalSponsorCarousel({ sponsors = [] }: { sponsors: Sponsor[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (sponsors.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [sponsors.length]);

    if (sponsors.length === 0) return null;

    const currentSponsor = sponsors[currentIndex];

    return (
        <div className="relative h-48 w-full flex items-center justify-center overflow-hidden">
            <div
                key={currentIndex}
                className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in duration-700"
            >
                <div className="bg-white rounded-xl flex items-center justify-center h-40 w-full max-w-2xl border border-gray-100 hover:border-virtus-yellow transition-colors group overflow-hidden relative shadow-sm">
                    {currentSponsor.logo ? (
                        currentSponsor.url ? (
                            <a
                                href={currentSponsor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative w-full h-full block"
                            >
                                <Image
                                    src={currentSponsor.logo}
                                    alt={currentSponsor.name}
                                    fill
                                    className="object-contain p-4 mix-blend-multiply"
                                    sizes="(max-width: 1024px) 100vw, 800px"
                                />
                            </a>
                        ) : (
                            <Image
                                src={currentSponsor.logo}
                                alt={currentSponsor.name}
                                fill
                                className="object-contain p-4 mix-blend-multiply"
                                sizes="(max-width: 1024px) 100vw, 800px"
                            />
                        )
                    ) : (
                        <span className="text-2xl font-bold text-gray-400">{currentSponsor.name}</span>
                    )}
                </div>
            </div>

            {/* Indicatori opzionali */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {sponsors.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-virtus-yellow w-4' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}
