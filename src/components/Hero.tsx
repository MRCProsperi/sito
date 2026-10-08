"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero.png"
                    alt="Virtus Velletri Basket Action"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-virtus-blue via-virtus-blue/50 to-transparent z-10"></div>

            {/* Content */}
            <div className="relative z-20 text-center max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 border border-virtus-yellow text-virtus-yellow text-xs font-bold tracking-[0.2em] uppercase mb-6 bg-virtus-blue/80 backdrop-blur-sm">
                        Since 1996
                    </span>
                    <h1 className="text-7xl md:text-9xl font-display font-bold text-white uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                        Virtus <span className="text-transparent bg-clip-text bg-gradient-to-r from-virtus-yellow to-yellow-600">Velletri</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-light tracking-wide mb-12 max-w-2xl mx-auto">
                        Since 1996
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/iscrizioni"
                            className="px-8 py-4 bg-virtus-yellow text-virtus-blue font-display font-bold text-xl uppercase tracking-wider hover:bg-white hover:text-virtus-blue transition-all duration-300 shadow-[0_0_20px_rgba(255,215,0,0.3)] skew-x-[-10deg] transform hover:-translate-y-1"
                        >
                            <span className="skew-x-[10deg] inline-block">Unisciti a Noi</span>
                        </Link>
                        <Link
                            href="/squadre"
                            className="px-8 py-4 border-2 border-white text-white font-display font-bold text-xl uppercase tracking-wider hover:bg-white hover:text-virtus-blue transition-all duration-300 skew-x-[-10deg]"
                        >
                            <span className="skew-x-[10deg] inline-block">Scopri i Team</span>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-virtus-yellow to-transparent"></div>
            </motion.div>
        </section>
    );
}
