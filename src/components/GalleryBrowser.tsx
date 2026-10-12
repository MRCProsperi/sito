"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Camera } from "lucide-react";
import type { GalleryAlbum } from "@/lib/gallery";

const seasonLabel = (s: string) => s.replace("-", "/");

export default function GalleryBrowser({ albums }: { albums: GalleryAlbum[] }) {
    const seasons = useMemo(() => Array.from(new Set(albums.map((a) => a.season))), [albums]);
    const [season, setSeason] = useState(seasons[0]);

    const shown = albums.filter((a) => a.season === season);

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

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((album) => (
                    <Link
                        key={album.slug}
                        href={`/gallery/${album.season}/${album.slug}`}
                        className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={album.photos[0].thumb} alt={`Copertina: ${album.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="flex items-center justify-between gap-3 p-4">
                            <h2 className="font-display text-lg font-bold uppercase leading-snug tracking-tight text-virtus-blue">{album.title}</h2>
                            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-gray-400">
                                <Camera className="h-4 w-4" /> {album.photos.length}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
