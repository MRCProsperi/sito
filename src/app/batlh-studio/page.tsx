import type { Metadata } from 'next';
import { Zap, Gauge, Wrench, RefreshCw } from 'lucide-react';
import BatlhContactForm from '@/components/BatlhContactForm';

export const metadata: Metadata = {
    title: { absolute: 'Batlh Studio | Realizzazione siti web' },
    description: 'Batlh Studio realizza siti web veloci, sicuri e curati nei dettagli: siti vetrina e restyling di siti esistenti. Scrivimi per un preventivo.',
    alternates: { canonical: '/batlh-studio' },
    openGraph: {
        title: 'Batlh Studio | Realizzazione siti web',
        description: 'Siti web veloci, sicuri e curati nei dettagli. Scrivimi per un preventivo.',
        siteName: 'Batlh Studio',
        url: '/batlh-studio',
        images: [{ url: '/images/batlh-studio-og.png', width: 1200, height: 630, alt: 'Batlh Studio' }],
    },
};

const RED = '#f5a524';
const CUT = '[clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]';

const SERVICES = [
    { icon: Zap, title: 'Siti vetrina', text: 'Il tuo lavoro online in modo chiaro: poche pagine, ben pensate, che si leggono bene da telefono.' },
    { icon: RefreshCw, title: 'Restyling', text: 'Il sito esiste ma è lento, vecchio o confuso? Lo rifaccio da capo, tenendo quello che funziona.' },
    { icon: Wrench, title: 'Cura nel tempo', text: 'Aggiornamenti, correzioni e piccole modifiche: il sito non resta fermo il giorno dopo la consegna.' },
];

const STEPS = [
    { n: '01', title: 'Ci parliamo', text: 'Mi racconti cosa fai e cosa ti serve. Senza giri di parole e senza gergo tecnico.' },
    { n: '02', title: 'Costruisco', text: 'Ti mostro presto una prima versione, così correggiamo la rotta mentre costruiamo.' },
    { n: '03', title: 'Vai online', text: 'Pubblico il sito, ti spiego come usarlo e resto a disposizione per quello che serve dopo.' },
];

function Emblem({ className = '' }: { className?: string }) {
    return (
        <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Logo Batlh Studio" fill={RED}>
            <path d="M 132 12 A 90 90 0 1 1 30 154 A 78 78 0 1 0 132 12 Z" />
            <path d="M 62 52 C 66 36 88 28 104 36 C 122 46 122 68 112 86 C 104 100 96 110 98 124 C 100 140 112 152 110 172 C 106 170 100 166 96 158 C 88 144 86 128 92 112 C 98 96 108 86 104 72 C 100 60 84 58 74 70 C 70 62 64 58 62 52 Z" />
            <path d="M 94 152 C 78 140 50 138 40 114 C 38 106 38 98 42 90 C 50 102 70 108 82 120 C 90 128 94 140 94 152 Z" />
            <path d="M 106 152 C 122 140 150 138 160 114 C 162 106 162 98 158 90 C 150 102 130 108 118 120 C 110 128 106 140 106 152 Z" />
        </svg>
    );
}

export default function BatlhStudioPage() {
    return (
        <div id="top" className="min-h-screen bg-[#1b1c1f] text-[#f3ead8] selection:bg-[#f5a524] selection:text-black">
            {/* TOP BAR */}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-[#f3ead8]/10 bg-[#1b1c1f]/85 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                    <a href="#top" className="flex items-center gap-3">
                        <Emblem className="h-9 w-9" />
                        <span className="text-sm font-black uppercase tracking-[0.25em]">Batlh <span className="text-[#f5a524]">Studio</span></span>
                    </a>
                    <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-[0.2em] text-[#f3ead8]/70">
                        <a href="#servizi" className="hidden transition-colors hover:text-[#f5a524] sm:inline">Servizi</a>
                        <a href="#contatti" className="border border-[#f5a524] px-4 py-2 text-[#f3ead8] transition-colors hover:bg-[#f5a524] hover:text-black">Contatti</a>
                    </nav>
                </div>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden border-b-4 border-[#f5a524] pt-32 pb-20 md:pt-40 md:pb-28">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-60"
                    style={{
                        background:
                            'radial-gradient(circle at 78% 30%, rgba(245,165,36,0.35), transparent 45%), repeating-linear-gradient(0deg, rgba(243,234,216,0.03) 0 1px, transparent 1px 32px)',
                    }}
                />
                <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[1.3fr_1fr]">
                    <div>
                        <p className="mb-5 text-xs font-bold uppercase tracking-[0.4em] text-[#f5a524]">Realizzazione siti web</p>
                        <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl">
                            Batlh <span className="text-[#f5a524]">Studio</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#f3ead8]/75">
                            Realizzo siti web veloci, sicuri e curati nei dettagli, per chi vuole farsi trovare e farsi ricordare.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <a
                                href="#contatti"
                                className={`${CUT} bg-[#f5a524] px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#f3ead8] hover:text-black`}
                            >
                                Chiedi un preventivo
                            </a>
                            <a
                                href="#servizi"
                                className={`${CUT} border border-[#f3ead8]/30 px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#f3ead8] transition-colors hover:border-[#f5a524] hover:text-[#f5a524]`}
                            >
                                Cosa faccio
                            </a>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Emblem className="h-64 w-64 drop-shadow-[0_0_36px_rgba(245,165,36,0.35)] md:h-80 md:w-80" />
                    </div>
                </div>
            </section>

            {/* SERVIZI */}
            <section id="servizi" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                <h2 className="mb-12 flex items-center text-3xl font-black uppercase tracking-tight md:text-4xl">
                    <span className="mr-4 h-9 w-3 bg-[#f5a524]" /> Cosa faccio
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {SERVICES.map(({ icon: Icon, title, text }) => (
                        <div key={title} className={`${CUT} border border-[#f3ead8]/10 bg-gradient-to-br from-[#2b2d33] to-[#202226] p-8 transition-colors hover:border-[#f5a524]/70`}>
                            <Icon className="mb-5 h-8 w-8 text-[#f5a524]" />
                            <h3 className="mb-2 text-xl font-black uppercase tracking-wide">{title}</h3>
                            <p className="leading-relaxed text-[#f3ead8]/65">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* COME LAVORO */}
            <section className="border-y border-[#f3ead8]/10 bg-[#222428]">
                <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
                    <h2 className="mb-12 flex items-center text-3xl font-black uppercase tracking-tight md:text-4xl">
                        <span className="mr-4 h-9 w-3 bg-[#f5a524]" /> Come lavoro
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {STEPS.map((s) => (
                            <div key={s.n} className="border-l-4 border-[#f5a524] pl-6">
                                <div className="mb-2 text-5xl font-black text-[#f5a524]/80">{s.n}</div>
                                <h3 className="mb-2 text-lg font-black uppercase tracking-wide">{s.title}</h3>
                                <p className="leading-relaxed text-[#f3ead8]/65">{s.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-14 flex items-start gap-4 border border-[#f3ead8]/10 bg-black/25 p-6">
                        <Gauge className="mt-1 h-7 w-7 shrink-0 text-[#f5a524]" />
                        <p className="leading-relaxed text-[#f3ead8]/70">
                            Ogni sito è pensato per essere <strong className="text-[#f3ead8]">veloce</strong> da aprire anche da telefono,
                            facile da aggiornare e trovato dai motori di ricerca. Niente fronzoli inutili: ogni elemento sulla pagina deve
                            avere uno scopo.
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTATTI */}
            <section id="contatti" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20 md:py-28">
                <h2 className="mb-3 flex items-center text-3xl font-black uppercase tracking-tight md:text-4xl">
                    <span className="mr-4 h-9 w-3 bg-[#f5a524]" /> Parliamone
                </h2>
                <p className="mb-10 text-[#f3ead8]/65">
                    Scrivimi due righe sul tuo progetto: ti rispondo con una proposta e un preventivo, senza impegno.
                </p>
                <div className={`${CUT} border border-[#f3ead8]/10 bg-[#26282c] p-6 md:p-10`}>
                    <BatlhContactForm />
                </div>
            </section>

            <footer className="border-t border-[#f3ead8]/10 py-8 text-center text-xs uppercase tracking-[0.25em] text-[#f3ead8]/40">
                &copy; {new Date().getFullYear()} Batlh Studio
            </footer>
        </div>
    );
}
