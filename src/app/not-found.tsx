import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, CalendarDays, Newspaper } from "lucide-react";

export const metadata: Metadata = {
    title: "Pagina non trovata",
    robots: { index: false },
};

function Ball({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="50" cy="50" r="46" />
            <line x1="4" y1="50" x2="96" y2="50" />
            <line x1="50" y1="4" x2="50" y2="96" />
            <path d="M 17 17 C 38 36 38 64 17 83" />
            <path d="M 83 17 C 62 36 62 64 83 83" />
        </svg>
    );
}

export default function NotFound() {
    return (
        <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-virtus-blue px-6 py-20 text-white">
            <Ball className="pointer-events-none absolute -left-24 top-10 h-72 w-72 -rotate-12 text-virtus-yellow opacity-10" />
            <Ball className="pointer-events-none absolute -bottom-20 -right-16 h-96 w-96 rotate-12 text-virtus-yellow opacity-10" />

            <div className="relative mx-auto max-w-2xl text-center">
                <div className="mb-6 flex items-center justify-center gap-3 font-display text-8xl font-black leading-none tracking-tighter md:text-9xl">
                    <span>4</span>
                    <Ball className="h-20 w-20 text-virtus-yellow motion-safe:animate-bounce md:h-28 md:w-28" />
                    <span>4</span>
                </div>
                <h1 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">Palla fuori!</h1>
                <p className="mx-auto mt-4 max-w-md text-white/80">
                    La pagina che cerchi non c&apos;è più, oppure l&apos;indirizzo non è corretto. Riparti da qui.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-virtus-yellow px-6 py-3 text-sm font-black uppercase tracking-wide text-virtus-blue transition-colors hover:bg-white">
                        <Home className="h-4 w-4" /> Torna alla home
                    </Link>
                    <Link href="/calendario" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:border-virtus-yellow hover:text-virtus-yellow">
                        <CalendarDays className="h-4 w-4" /> Calendario
                    </Link>
                    <Link href="/news" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:border-virtus-yellow hover:text-virtus-yellow">
                        <Newspaper className="h-4 w-4" /> News
                    </Link>
                </div>

                <p className="mt-10 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-white/50">
                    Virtus Velletri Basket <ArrowRight className="h-3 w-3" /> dal 1996
                </p>
            </div>
        </section>
    );
}
