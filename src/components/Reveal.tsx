"use client";

import { useEffect, useRef } from "react";

// Fades a block in when it scrolls into view. Server-rendered content stays visible (no-JS safe):
// only blocks that start below the fold are hidden after hydration, then revealed on scroll.
// Skipped entirely for people who prefer reduced motion.
export default function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
        if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave as is

        el.classList.add("reveal");
        const io = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) {
                el.classList.add("is-visible");
                io.disconnect();
            }
        }, { rootMargin: "0px 0px -8% 0px" });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return <div ref={ref} className={className}>{children}</div>;
}
