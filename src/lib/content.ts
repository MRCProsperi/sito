import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

const SAFE_SLUG = /^[a-z0-9][a-z0-9-_]*$/i;

export type MenuItem = {
    label: string;
    href: string;
    children?: MenuItem[];
};

export function getMenu(): MenuItem[] {
    try {
        const fullPath = path.join(contentDirectory, 'config', 'menu.json');
        if (!fs.existsSync(fullPath)) return [];
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading menu:", error);
        return [];
    }
}

export function getPageContent(slug: string) {
    const realSlug = slug.replace(/\.md$/, '');
    if (!SAFE_SLUG.test(realSlug)) return null;
    const fullPath = path.join(contentDirectory, 'pages', `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return { slug: realSlug, meta: data, content };
}

export function getAllPages() {
    const pagesDir = path.join(contentDirectory, 'pages');
    if (!fs.existsSync(pagesDir)) return [];

    return fs.readdirSync(pagesDir)
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => getPageContent(fileName))
        .filter((p): p is NonNullable<typeof p> => p !== null);
}

// ----------------------------------------------------------------------------
// NEW MIGRATED METHODS FOR STANDINGS AND MATCHES
// ----------------------------------------------------------------------------

export function getAllStandings() {
    const dir = path.join(contentDirectory, 'standings');
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir);
    return files.map((fileName) => {
        // Prevent reading non-md files
        if (!fileName.endsWith('.md')) return null;

        const fullPath = path.join(dir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        return {
            title: data.title,
            categoryId: data.team_slug, // Keep existing property name for compatibility or mapping
            team_slug: data.team_slug,
            data: data.table || [] // Map 'table' from YAML to 'data' prop expected by widget
        };
    }).filter((item): item is NonNullable<typeof item> => item !== null && item.data.length > 0);
}

export interface MatchEvent {
    title: string;
    date: string;
    time?: string;
    location?: string;
    category?: string;
    teamId?: string;
    slug: string;
    score?: string;
}

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

// A CMS may save dates and times without quotes: YAML then gives a Date for 2026-10-11 and a number of minutes for 19:00.
function normalizeEvent(event: MatchEvent): MatchEvent {
    const date: unknown = event.date;
    const time: unknown = event.time;
    return {
        ...event,
        date: date instanceof Date ? date.toISOString().slice(0, 10) : String(date ?? ''),
        time: typeof time === 'number' ? `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}` : (time == null ? undefined : String(time)),
    };
}

export function getAllMatches(): MatchEvent[] {
    const dir = path.join(contentDirectory, 'matches');
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir);
    return files.flatMap((fileName) => {
        // Prevent reading non-md files
        if (!fileName.endsWith('.md')) return [];

        const fullPath = path.join(dir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        // Return individual events, but enrich them with group info if needed
        return ((data.events || []) as MatchEvent[]).map((raw) => {
            const event = normalizeEvent(raw);
            const slug = slugify(`${event.title}-${event.date}`);
            return {
                ...event,
                slug,
                teamId: data.team_slug // Inject team_slug into each event
            };
        });
    });
}

export function getMatchBySlug(slug: string): MatchEvent | null {
    const allMatches = getAllMatches();
    return allMatches.find(m => m.slug === slug) || null;
}

// ----------------------------------------------------------------------------
// NEWS METHODS
// ----------------------------------------------------------------------------

export function getAllNews() {
    const dir = path.join(contentDirectory, 'news');
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir);
    return files.map((fileName) => {
        if (!fileName.endsWith('.md')) return null;

        const fullPath = path.join(dir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const slug = fileName.replace(/\.md$/, '');

        return {
            slug,
            meta: data,
            content
        };
    }).filter((n): n is NonNullable<typeof n> => n !== null)
        .sort((a, b) => (Date.parse(b.meta.date) || 0) - (Date.parse(a.meta.date) || 0));
}

export function getNewsBySlug(slug: string) {
    if (!SAFE_SLUG.test(slug)) return null;
    const fullPath = path.join(contentDirectory, 'news', `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return { slug, meta: data, content };
}
export function getSponsors() {
    try {
        const fullPath = path.join(contentDirectory, 'config', 'sponsors.json');
        if (!fs.existsSync(fullPath)) return [];
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading sponsors:", error);
        return [];
    }
}
