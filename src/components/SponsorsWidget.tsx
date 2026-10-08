"use client";

import Image from "next/image";
import Link from "next/link";

interface Sponsor {
  name: string;
  logo: string;
  url?: string;
}

export default function SponsorsWidget({ sponsors = [] }: { sponsors?: Sponsor[] }) {
  if (sponsors.length === 0) return null;
  const displaySponsors: Sponsor[] = sponsors;

  return (
    <section className="bg-white rounded-lg p-6 shadow-md mb-8">
      <h3 className="text-xl font-display font-bold text-virtus-blue uppercase tracking-tight mb-4 pb-2 border-b-2 border-virtus-yellow">
        Partner
      </h3>
      <div className="h-80 overflow-hidden relative">
        <div className="animate-scroll-up space-y-4">
          {displaySponsors.map((sponsor, i) => (
            <div key={i} className="bg-white rounded p-1 flex items-center justify-center h-24 border border-gray-200 hover:border-virtus-yellow transition-colors flex-shrink-0 group overflow-hidden relative">
              {sponsor.logo ? (
                sponsor.url ? (
                  <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain transition-all"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  </a>
                ) : (
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain transition-all"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                )
              ) : (
                <span className="text-sm font-bold text-gray-400">{sponsor.name}</span>
              )}
            </div>
          ))}
          {/* Duplicate for infinite scroll */}
          {displaySponsors.map((sponsor, i) => (
            <div key={`dup-${i}`} className="bg-white rounded p-1 flex items-center justify-center h-24 border border-gray-200 hover:border-virtus-yellow transition-colors flex-shrink-0 group overflow-hidden relative">
              {sponsor.logo ? (
                sponsor.url ? (
                  <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="relative w-full h-full block">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      className="object-contain transition-all"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                  </a>
                ) : (
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain transition-all"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                )
              ) : (
                <span className="text-sm font-bold text-gray-400">{sponsor.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        
        .animate-scroll-up {
          animation: scrollUp 20s linear infinite;
        }
        
        .animate-scroll-up:hover {
          animation-play-state: paused;
        }
      `}</style>
      <Link href="/diventa-sponsor" className="mt-4 block text-center text-xs font-bold uppercase tracking-wide text-virtus-blue underline hover:text-virtus-yellow">
        Diventa sponsor
      </Link>
    </section>
  );
}
