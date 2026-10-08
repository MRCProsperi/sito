// Header backgrounds for the news detail page, chosen by the `category` field in the news front matter.
export const NEWS_CATEGORIES = {
    dr1: { label: 'DR1', bg: '/images/news-bg/dr1.svg' },
    giovanili: { label: 'Giovanili', bg: '/images/news-bg/giovanili.svg' },
    minibasket: { label: 'Minibasket', bg: '/images/news-bg/minibasket.svg' },
    generica: { label: 'News', bg: '/images/news-bg/generica.svg' },
} as const;

export type NewsCategory = keyof typeof NEWS_CATEGORIES;

export function newsCategory(value: unknown): (typeof NEWS_CATEGORIES)[NewsCategory] {
    const key = String(value ?? '').toLowerCase() as NewsCategory;
    return NEWS_CATEGORIES[key] ?? NEWS_CATEGORIES.generica;
}
