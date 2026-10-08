import type { Metadata } from 'next';
import { SEASON } from '@/lib/site';

export const metadata: Metadata = {
    title: `Modulo Iscrizione Minibasket ${SEASON}`,
    description: 'Annate, sedi di allenamento e come iscriversi: scarica il modulo di iscrizione al minibasket della Virtus Velletri.',
    alternates: { canonical: '/iscrizioni/modulo-minibasket' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
