import fs from 'fs';
import path from 'path';

export interface InstagramPost {
    id: string;
    caption?: string;
    permalink: string;
    /** Local image, downloaded by scripts/fetch-instagram.mjs before each build */
    image: string;
    timestamp?: string;
}

/**
 * Posts shown in the Instagram grid. They are written to content/config/instagram.json
 * by `npm run build` (prebuild script). An empty file means: show only the profile link.
 */
export function getInstagramPosts(): InstagramPost[] {
    try {
        const file = path.join(process.cwd(), 'content', 'config', 'instagram.json');
        if (!fs.existsSync(file)) return [];
        const posts = JSON.parse(fs.readFileSync(file, 'utf8'));
        return Array.isArray(posts) ? posts : [];
    } catch (error) {
        console.error('Error reading instagram.json:', error);
        return [];
    }
}
