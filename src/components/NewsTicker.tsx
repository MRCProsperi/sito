"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface NewsItem {
    id: number;
    text: string;
    link: string;
}

interface NewsTickerProps {
    news: NewsItem[];
}

export default function NewsTicker({ news }: NewsTickerProps) {
    const [isPaused, setIsPaused] = useState(false);

    // Duplichiamo le news per garantire uno scroll continuo senza buchi
    const duplicatedNews = [...news, ...news, ...news];

    return (
        <div className="w-full bg-virtus-blue text-white overflow-hidden border-b border-virtus-yellow relative flex items-center h-12">
            {/* Label fissa a sinistra */}
            <div className="absolute left-0 z-30 h-full bg-virtus-yellow text-virtus-blue font-bold px-4 flex items-center justify-center uppercase tracking-wider text-sm md:text-base shadow-md min-w-[140px]">
                Latest News
            </div>

            {/* Triangolo decorativo rimosso */}


            {/* Container scorrevole */}
            <div
                className="flex whitespace-nowrap animate-ticker"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            >
                {duplicatedNews.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center mx-4">
                        <span className="text-virtus-yellow mr-2 text-xl">•</span>
                        <Link
                            href={item.link}
                            className="text-sm md:text-base font-medium hover:text-virtus-yellow transition-colors mr-8"
                        >
                            {item.text}
                        </Link>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-ticker {
          animation: ticker 40s linear infinite;
          padding-left: 150px; /* Spazio per la label "Latest News" */
        }

        @media (min-width: 768px) {
           .animate-ticker {
              padding-left: 150px;
           }
        }
      `}</style>
        </div>
    );
}
