import { Camera } from 'lucide-react';
import { Metadata } from 'next';
import GalleryBrowser from '@/components/GalleryBrowser';
import { getGalleryAlbums } from '@/lib/gallery';

const albums = getGalleryAlbums();

export const metadata: Metadata = {
    title: 'Galleria fotografica',
    description: 'Le foto più belle delle partite, degli allenamenti e degli eventi della Virtus Velletri, stagione per stagione.',
    alternates: { canonical: '/gallery' },
    // stay out of search results until there are photos to show
    robots: albums.length ? undefined : { index: false },
};

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-virtus-blue md:text-5xl">Galleria Fotografica</h1>
                    <p className="mx-auto max-w-2xl text-gray-600">Partite, allenamenti ed eventi della Virtus, stagione per stagione.</p>
                </div>

                {albums.length > 0 ? (
                    <GalleryBrowser albums={albums} />
                ) : (
                    <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                        <Camera className="mx-auto mb-4 h-10 w-10 text-virtus-yellow" />
                        <p className="font-bold text-virtus-blue">Le foto arriveranno presto</p>
                        <p className="mt-2 text-sm text-gray-500">Stiamo preparando gli album della stagione. Torna a trovarci!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
