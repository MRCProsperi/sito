import RegistrationInfo from '@/components/RegistrationInfo';

export default function RegistrationPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Minimal Background for the page */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
                <div className="absolute inset-0 bg-[url('/images/logo.png')] bg-center bg-no-repeat bg-[length:50vh]"></div>
            </div>

            <div className="relative z-10">
                <RegistrationInfo type="minibasket" />
            </div>

            <footer className="max-w-4xl mx-auto py-8 text-center text-gray-400 text-xs px-4">
                <p>Copyright © {new Date().getFullYear()} Virtus Velletri Basket. Tutti i diritti riservati.</p>
                <p className="mt-2 italic">Per assistenza nella compilazione: WhatsApp 388 753 3635</p>
            </footer>
        </div>
    );
}
