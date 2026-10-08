"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Standalone pages (own look, own header and footer) are shown without the Virtus navbar, footer and structured data.
const STANDALONE = ["/batlh-studio"];

export default function SiteChrome({ navbar, footer, jsonLd, children }: { navbar: ReactNode; footer: ReactNode; jsonLd: ReactNode; children: ReactNode }) {
    const pathname = usePathname() || "";
    const standalone = STANDALONE.some((p) => pathname === p || pathname.startsWith(`${p}/`));

    if (standalone) return <main className="min-h-screen">{children}</main>;

    return (
        <>
            {jsonLd}
            {navbar}
            <main className="pt-20 min-h-screen">{children}</main>
            {footer}
        </>
    );
}
