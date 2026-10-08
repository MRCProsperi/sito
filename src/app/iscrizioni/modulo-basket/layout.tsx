import type { Metadata } from 'next';
import { SEASON } from '@/lib/site';

export const metadata: Metadata = {
    title: `Modulo Iscrizione Basket ${SEASON}`,
    description: 'Annate, sedi di allenamento e come iscriversi: scarica il modulo di iscrizione al basket agonistico della Virtus Velletri.',
    alternates: { canonical: '/iscrizioni/modulo-basket' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
