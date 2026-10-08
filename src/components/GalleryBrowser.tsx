"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryAlbum } from "@/lib/gallery";

const seasonLabel = (s: string) => s.replace("-", "/");

export default function GalleryBrowser({ albums }: { albums: GalleryAlbum[] }) {
    const seasons = useMemo(() => Array.from(new Set(albums.map((a) => a.season))), [albums]);
    const [season, setSeason] = useState(seasons[0]);
    const [open, setOpen] = useState<{ album: GalleryAlbum; index: number } | null>(null);

    const shown = albums.filter((a) => a.season === season);

    const step = useCallback((delta: number) => {
        setOpen((cur) => (cur ? { album: cur.album, index: (cur.index + delta + cur.album.photos.length) % cur.album.photos.length } : cur));
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(null);
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
    }, [open, step]);

    return (
        <div>
            {seasons.length > 1 && (
                <div className="mb-10 flex flex-wrap justify-center gap-2">
                    {seasons.map((s) => (
                        <button
                            key={s}
                            onClick={() => setSeason(s)}
                            className={`rounded-full border px-5 py-2 text-xs font-black uppercase tracking-wider transition-all ${s === season ? "border-virtus-blue bg-virtus-blue text-white" : "border-gray-200 bg-white text-gray-500 hover:border-virtus-yellow"}`}
                        >
                            Stagione {seasonLabel(s)}
                        </button>
                    ))}
                </div>
            )}

            <div className="space-y-14">
                {shown.map((album) => (
                    <section key={album.slug} aria-labelledby={`album-${album.slug}`}>
                        <h2 id={`album-${album.slug}`} className="mb-5 flex items-center text-2xl font-display font-bold uppercase tracking-tight text-virtus-blue">
                            <span className="mr-4 h-7 w-2 bg-virtus-yellow" /> {album.title}
                            <span className="ml-3 text-sm font-medium normal-case text-gray-400">{album.photos.length} foto</span>
                        </h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {album.photos.map((photo, i) => (
                                <button
                                    key={photo.thumb}
                                    onClick={() => setOpen({ album, index: i })}
                                    className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-virtus-yellow"
                                    aria-label={`Apri la foto ${i + 1} di ${album.title}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={photo.thumb} alt={`${album.title}, foto ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                </button>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={open.album.title} onClick={() => setOpen(null)}>
                    <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={() => setOpen(null)} aria-label="Chiudi">
                        <X className="h-6 w-6" />
                    </button>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-6" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Foto precedente">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={open.album.photos[open.index].large} alt={`${open.album.title}, foto ${open.index + 1}`} className="max-h-[88vh] max-w-full rounded object-contain" onClick={(e) => e.stopPropagation()} />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-6" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Foto successiva">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                    <p className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold uppercase tracking-widest text-white/70">
                        {open.album.title} · {open.index + 1}/{open.album.photos.length}
                    </p>
                </div>
            )}
        </div>
    );
}
