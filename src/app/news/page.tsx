import { getAllNews } from '@/lib/content';
import Link from 'next/link';
import { SEASON } from '@/lib/site';
import Image from 'next/image';
import { Calendar, ChevronRight } from 'lucide-react';

export const metadata = {
    title: 'Ultime News',
    alternates: { canonical: '/news' },
    description: 'Resta aggiornato su tutte le novità, i risultati e gli eventi della Virtus Velletri.',
};

export default function NewsPage() {
    const news = getAllNews();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header Hero */}
            <div className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero.png"
                        alt="News Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-virtus-blue/85"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 uppercase tracking-tighter">
                        Ultime <span className="text-virtus-yellow">News</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white text-justify md:text-center leading-relaxed italic max-w-3xl mx-auto font-medium">
                        Resta aggiornato su tutte le novità, i risultati e gli eventi della Virtus Velletri per la stagione {SEASON}.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <Link
                            key={item.slug}
                            href={`/news/${item.slug}`}
                            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <Image
                                    src={item.meta.image || "/images/hero.png"}
                                    alt={item.meta.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-virtus-yellow text-virtus-blue text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                        News
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(item.meta.date).toLocaleDateString('it-IT', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>

                                <h3 className="text-xl font-display font-bold text-virtus-blue mb-3 group-hover:text-virtus-gold transition-colors line-clamp-2 uppercase tracking-tight">
                                    {item.meta.title}
                                </h3>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {item.meta.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-virtus-blue font-bold text-xs uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Leggi tutto <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {news.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-inner">
                        <p className="text-gray-400 font-medium">Nessuna notizia disponibile al momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
