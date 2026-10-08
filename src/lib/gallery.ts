import fs from 'node:fs';
import path from 'node:path';

export interface GalleryPhoto { thumb: string; large: string; }
export interface GalleryAlbum { season: string; slug: string; title: string; photos: GalleryPhoto[]; }

interface ManifestAlbum { season: string; slug: string; title: string; photos: string[]; }

// Albums come from public/galleria/manifest.json, written by scripts/make-gallery.mjs before each build.
export function getGalleryAlbums(): GalleryAlbum[] {
    const file = path.join(process.cwd(), 'public', 'galleria', 'manifest.json');
    if (!fs.existsSync(file)) return [];
    const manifest = JSON.parse(fs.readFileSync(file, 'utf8')) as ManifestAlbum[];
    const albums = manifest.map((a) => ({
        season: a.season,
        slug: a.slug,
        title: a.title,
        photos: a.photos.map((base) => ({
            thumb: `/galleria/${a.season}/${a.slug}/${base}-t.jpg`,
            large: `/galleria/${a.season}/${a.slug}/${base}-l.jpg`,
        })),
    }));
    // newest season first, albums by name
    return albums.sort((a, b) => b.season.localeCompare(a.season) || a.title.localeCompare(b.title));
}
