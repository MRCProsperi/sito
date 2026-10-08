import { getAllMatches } from '@/lib/content';
import type { Metadata } from 'next';
import GlobalCalendar from './GlobalCalendar';

export const metadata: Metadata = {
    title: 'Calendario Gare',
    description: 'Tutte le partite di tutte le squadre della Virtus Velletri: date, orari e palestre.',
    alternates: { canonical: '/calendario' },
};

export default function CalendarPage() {
    const allMatches = getAllMatches();

    return <GlobalCalendar initialMatches={allMatches} />;
}
