import { getNewsBySlug, getAllNews } from '@/lib/content';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/site';
import Link from 'next/link';
import { Calendar, ChevronLeft, Share2, Download, ImageDown } from 'lucide-react';
import { newsCategory } from '@/lib/newsBackgrounds';

export async function generateStaticParams() {
    const news = getAllNews();
    return news.map((item) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = getNewsBySlug(slug);

    if (!item) return { title: 'News non trovata' };

    return {
        title: /virtus velletri/i.test(item.meta.title) ? { absolute: item.meta.title } : item.meta.title,
        description: item.meta.description,
        alternates: { canonical: `/news/${slug}` },
        openGraph: {
            type: 'article' as const,
            title: item.meta.title,
            description: item.meta.description,
            url: `/news/${slug}`,
            publishedTime: item.meta.date ? String(item.meta.date) : undefined,
            images: [item.meta.image || '/images/hero.png'],
        },
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = getNewsBySlug(slug);

    if (!item) notFound();

    const category = newsCategory(item.meta.category);

    return (
        <div className="bg-gray-50 min-h-screen">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'NewsArticle',
                    headline: item.meta.title,
                    description: item.meta.description,
                    datePublished: item.meta.date ? String(item.meta.date) : undefined,
                    image: `${SITE_URL}${item.meta.image || '/images/hero.png'}`,
                    mainEntityOfPage: `${SITE_URL}/news/${slug}`,
                    author: { '@type': 'Organization', name: 'Virtus Velletri Basket' },
                    publisher: { '@type': 'Organization', name: 'Virtus Velletri Basket', logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` } },
                }}
            />
            {/* Minimal Header for Blog Post */}
            <div
                className="relative w-full pt-20 bg-virtus-blue bg-cover bg-center"
                style={{ backgroundImage: `url(${category.bg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-virtus-blue/70 to-transparent"></div>

                <div className="relative w-full px-8 pt-24 pb-12 md:px-16 md:pt-32 md:pb-16">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-virtus-yellow text-sm font-bold uppercase tracking-wider mb-6 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Torna alle News
                        </Link>

                        <span className="inline-block bg-virtus-yellow text-virtus-blue text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">{category.label}</span>
                        <div className="flex items-center gap-3 text-virtus-yellow text-sm font-bold uppercase tracking-widest mb-4">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.meta.date).toLocaleDateString('it-IT', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white uppercase tracking-tighter leading-none">
                            {item.meta.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-16">
                        {item.meta.showImage && item.meta.image && (
                            <figure className="mb-12 not-prose text-center">
                                <a href={item.meta.image} target="_blank" rel="noopener noreferrer" title="Apri l'immagine a grandezza intera">
                                    <Image
                                        src={item.meta.image}
                                        alt={item.meta.title}
                                        width={1080}
                                        height={1350}
                                        sizes="(max-width: 768px) 100vw, 560px"
                                        className="mx-auto h-auto w-full max-w-xl rounded-2xl shadow-xl border border-gray-100"
                                    />
                                </a>
                                <figcaption className="mt-3 text-xs text-gray-400">Tocca l&apos;immagine per ingrandirla</figcaption>
                                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                    {item.meta.downloadPdf && (
                                        <a
                                            href={item.meta.downloadPdf}
                                            download
                                            className="inline-flex items-center gap-2 rounded-lg bg-virtus-blue px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-virtus-blue/90"
                                        >
                                            <Download className="w-4 h-4" /> Scarica il calendario (PDF)
                                        </a>
                                    )}
                                    <a
                                        href={item.meta.image}
                                        download
                                        className="inline-flex items-center gap-2 rounded-lg border-2 border-virtus-blue px-5 py-3 text-sm font-bold uppercase tracking-wide text-virtus-blue transition-colors hover:bg-virtus-blue hover:text-white"
                                    >
                                        <ImageDown className="w-4 h-4" /> Scarica l&apos;immagine
                                    </a>
                                </div>
                            </figure>
                        )}
                        <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-virtus-blue prose-p:text-gray-700 prose-strong:text-virtus-blue prose-blockquote:border-virtus-yellow prose-blockquote:bg-gray-50 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-a:text-virtus-blue hover:prose-a:text-virtus-yellow transition-colors">
                            <ReactMarkdown>{item.content}</ReactMarkdown>
                        </article>

                        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-gray-400 text-sm font-medium">
                                © {new Date().getFullYear()} Virtus Velletri Basket
                            </div>
                            <button className="flex items-center gap-2 text-virtus-blue hover:text-virtus-gold font-bold text-sm uppercase tracking-wider transition-colors">
                                <Share2 className="w-4 h-4" /> Condividi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
