import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MoveLeft } from 'lucide-react';
import AlbumViewer from '@/components/AlbumViewer';
import { getGalleryAlbum, getGalleryAlbums } from '@/lib/gallery';

type Params = { season: string; slug: string };

export async function generateStaticParams() {
    const albums = getGalleryAlbums();
    // A static export needs at least one path: with no albums yet a placeholder is generated and renders 404
    if (albums.length === 0) return [{ season: 'nessuna-stagione', slug: 'nessun-album' }];
    return albums.map((a) => ({ season: a.season, slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { season, slug } = await params;
    const album = getGalleryAlbum(season, slug);
    if (!album) return { title: 'Album non trovato' };
    return {
        title: `${album.title} - Galleria fotografica`,
        description: `${album.photos.length} foto: ${album.title}, stagione ${season.replace('-', '/')}.`,
        alternates: { canonical: `/gallery/${season}/${slug}` },
        openGraph: { images: [album.photos[0].large] },
    };
}

export default async function AlbumPage({ params }: { params: Promise<Params> }) {
    const { season, slug } = await params;
    const album = getGalleryAlbum(season, slug);
    if (!album) notFound();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
                <Link
                    href="/gallery"
                    className="group mb-8 inline-flex items-center font-bold text-virtus-blue transition-colors hover:text-virtus-gold"
                >
                    <MoveLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Tutte le gallerie
                </Link>

                <div className="mb-10">
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-virtus-blue md:text-5xl">{album.title}</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                        Stagione {season.replace('-', '/')} · {album.photos.length} foto
                    </p>
                </div>

                <AlbumViewer album={album} />
            </div>
        </div>
    );
}
