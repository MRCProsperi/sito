import Link from "next/link";
import { Facebook, Instagram, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-virtus-blue text-white pt-16 pb-8 border-t border-virtus-yellow/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Logo & Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-virtus-yellow tracking-tight">VIRTUS VELLETRI</h3>
                        <p className="text-white/80 mb-6 leading-relaxed">
                            S.S.DIL. Virtus Velletri.<br />
                            Promuoviamo il basket e i suoi valori dal 1996.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://www.facebook.com/virtusvelletribasket/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full text-white hover:bg-virtus-yellow hover:text-virtus-blue transition-all duration-300">
                                <Facebook size={20} />
                            </Link>
                            <Link href="https://www.instagram.com/virtusvelletri_bk/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full text-white hover:bg-virtus-yellow hover:text-virtus-blue transition-all duration-300">
                                <Instagram size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-virtus-yellow">Link Rapidi</h3>
                        <ul className="space-y-3 text-white/80">
                            <li><Link href="/storia" className="hover:text-virtus-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-virtus-yellow rounded-full"></span>La Storia</Link></li>
                            <li><Link href="/contatti" className="hover:text-virtus-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-virtus-yellow rounded-full"></span>Contatti</Link></li>
                        </ul>
                    </div>

                    {/* Contatti */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-virtus-yellow">Contatti</h3>
                        <ul className="space-y-4 text-white/80">
                            <li className="flex items-start">
                                <MapPin size={20} className="mr-3 mt-1 text-virtus-yellow flex-shrink-0" />
                                <span>Palestra Polivalente<br />Via del Campo Sportivo, Velletri</span>
                            </li>
                            <li className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-virtus-yellow flex-shrink-0"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                                <span>
                                    <span className="block text-sm opacity-70">What&apos;s App</span>
                                    <a href="https://wa.me/393887533635" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">388 753 3635</a>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm space-y-2">
                    <p>&copy; {new Date().getFullYear()} S.S.DIL. Virtus Velletri. Tutti i diritti riservati. · <Link href="/privacy" className="hover:text-virtus-yellow transition-colors">Privacy</Link></p>
                    <p className="text-xs opacity-75">Realizzazione sito: <Link href="/batlh-studio" className="font-semibold text-virtus-yellow hover:underline">Batlh Studio</Link></p>
                </div>
            </div>
        </footer>
    );
}
