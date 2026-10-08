import type { Metadata } from "next";
import { Inter, Outfit, Oswald } from "next/font/google"; // Using better fonts
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMenu } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import SiteChrome from "@/components/SiteChrome";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Virtus Velletri Basket", template: "%s | Virtus Velletri" },
  description: "Sito ufficiale della s.s.dil. Virtus Velletri. Storia, Squadre e Passione.",
  openGraph: {
    siteName: "Virtus Velletri Basket",
    locale: "it_IT",
    type: "website",
    images: [{ url: "/images/hero.png", width: 1200, height: 630, alt: "Virtus Velletri Basket" }],
  },
  twitter: { card: "summary_large_image" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsClub",
  name: "Virtus Velletri Basket",
  sport: "Basketball",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  address: { "@type": "PostalAddress", addressLocality: "Velletri", addressRegion: "RM", addressCountry: "IT" },
  sameAs: [
    "https://www.facebook.com/virtusvelletribasket/",
    "https://www.instagram.com/virtusvelletri_bk/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menu = getMenu();

  return (
    <html lang="it">
      <body
        className={`${inter.variable} ${outfit.variable} ${oswald.variable} antialiased bg-gray-50 text-gray-900 font-sans`}
      >
        <SiteChrome navbar={<Navbar menu={menu} />} footer={<Footer />} jsonLd={<JsonLd data={organizationJsonLd} />}>
          {children}
        </SiteChrome>
        {/* Privacy-friendly visit statistics (GoatCounter: no cookies, no personal data) */}
        <Script data-goatcounter="https://batlhstudio.goatcounter.com/count" src="https://gc.zgo.at/count.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
