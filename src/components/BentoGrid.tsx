"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Calendar, Image as ImageIcon } from "lucide-react";

const items = [
    {
        title: "PRIMA SQUADRA",
        subtitle: "DIVISIONE REGIONALE 1",
        description: "Scopri il roster della squadra.",
        href: "/dr1",
        icon: Users,
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-virtus-blue"
    },
    {
        title: "GALLERIA",
        subtitle: "FOTO DELLE NOSTRE SQUADRE",
        description: "I momenti più belli della stagione.",
        href: "/gallery",
        icon: ImageIcon,
        colSpan: "col-span-1",
        bg: "bg-virtus-yellow",
        textColor: "text-virtus-blue"
    },
    {
        title: "CALENDARIO E RISULTATI",
        subtitle: "PROSSIME GARE",
        description: "Non perdere nemmeno una partita.",
        href: "/calendario",
        icon: Calendar,
        colSpan: "col-span-1",
        bg: "bg-virtus-blue"
    }
];

export default function BentoGrid({ compact = false }: { compact?: boolean }) {
    const content = (
        <>
            {!compact && (
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-virtus-blue uppercase tracking-tighter">
                        Il Mondo Virtus
                    </h2>
                    <div className="h-2 w-24 bg-virtus-yellow mt-4"></div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[300px]">
                {items.map((item, index) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`${item.colSpan} relative group overflow-hidden rounded-none shadow-[0_10px_30px_-10px_rgba(31,50,90,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(31,50,90,0.4)] transition-all duration-500`}
                    >
                        <Link href={item.href} className={`block h-full w-full p-8 flex flex-col justify-end ${item.bg} ${item.textColor || 'text-white'}`}>
                            <div className="absolute top-8 right-8 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500">
                                <item.icon size={80} />
                            </div>
                            <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="text-xs font-bold tracking-widest uppercase mb-2 opacity-80">{item.subtitle}</div>
                                <h3 className="text-3xl font-display font-bold uppercase tracking-tight mb-2 leading-none">{item.title}</h3>
                                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-sm font-medium mb-4 max-w-xs">
                                    {item.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                    Vai alla sezione <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </>
    );

    if (compact) {
        return <div>{content}</div>;
    }

    return (
        <section className="py-0 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {content}
            </div>
        </section>
    );
}
