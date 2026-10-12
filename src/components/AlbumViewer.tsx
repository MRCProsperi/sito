"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryAlbum } from "@/lib/gallery";

export default function AlbumViewer({ album }: { album: GalleryAlbum }) {
    const [index, setIndex] = useState<number | null>(null);
    const total = album.photos.length;

    const step = useCallback((delta: number) => {
        setIndex((cur) => (cur === null ? cur : (cur + delta + total) % total));
    }, [total]);

    useEffect(() => {
        if (index === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIndex(null);
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
    }, [index, step]);

    return (
        <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {album.photos.map((photo, i) => (
                    <button
                        key={photo.thumb}
                        onClick={() => setIndex(i)}
                        className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-virtus-yellow"
                        aria-label={`Apri la foto ${i + 1} di ${album.title}`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo.thumb} alt={`${album.title}, foto ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </button>
                ))}
            </div>

            {index !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={album.title} onClick={() => setIndex(null)}>
                    <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={() => setIndex(null)} aria-label="Chiudi">
                        <X className="h-6 w-6" />
                    </button>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-6" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Foto precedente">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={album.photos[index].large} alt={`${album.title}, foto ${index + 1}`} className="max-h-[88vh] max-w-full rounded object-contain" onClick={(e) => e.stopPropagation()} />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-6" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Foto successiva">
                        <ChevronRight className="h-6 w-6" />
                    </button>
                    <p className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold uppercase tracking-widest text-white/70">
                        {album.title} · {index + 1}/{total}
                    </p>
                </div>
            )}
        </div>
    );
}
