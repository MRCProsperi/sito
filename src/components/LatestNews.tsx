import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { newsCategory } from "@/lib/newsBackgrounds";

export interface LatestNewsItem {
    slug: string;
    title: string;
    date: string;
    description?: string;
    image?: string;
    category?: string;
}

const dateLabel = (d: string) =>
    new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });

// Home block: the three latest news, text only (compact).
export default function LatestNews({ items }: { items: LatestNewsItem[] }) {
    if (items.length === 0) return null;
    return (
        <section aria-labelledby="ultime-news">
            <div className="mb-6 flex items-end justify-between gap-4">
                <h2 id="ultime-news" className="section-title">
                    Ultime news
                </h2>
                <Link href="/news" className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-virtus-blue transition-colors hover:text-virtus-gold">
                    Tutte le news <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {items.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/news/${item.slug}`}
                        className="group flex flex-col rounded-2xl border border-gray-100 border-t-4 border-t-virtus-yellow bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="rounded-full bg-virtus-blue px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                {newsCategory(item.category).label}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar className="h-3.5 w-3.5" /> {dateLabel(item.date)}
                            </span>
                        </div>
                        <h3 className="card-title line-clamp-3 transition-colors group-hover:text-virtus-gold">
                            {item.title}
                        </h3>
                        {item.description && (
                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
                        )}
                        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-bold uppercase tracking-wide text-virtus-blue group-hover:text-virtus-gold">
                            Leggi <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
