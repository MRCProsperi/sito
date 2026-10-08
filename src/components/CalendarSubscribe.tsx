import { CalendarPlus, Download } from "lucide-react";

const HOST = "www.virtusvelletri.it";

// Two ways to put the matches on a phone: subscribe (webcal, stays updated) or download the .ics file once.
export default function CalendarSubscribe({ team = "tutte-le-squadre", label = "Tutte le squadre" }: { team?: string; label?: string }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">Metti le partite nel tuo calendario · {label}</p>
            <div className="flex flex-wrap gap-3">
                <a
                    href={`webcal://${HOST}/calendari/${team}.ics`}
                    className="inline-flex items-center gap-2 rounded-lg bg-virtus-blue px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-virtus-blue/90"
                >
                    <CalendarPlus className="h-4 w-4" /> Iscriviti (si aggiorna da solo)
                </a>
                <a
                    href={`/calendari/${team}.ics`}
                    download
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-virtus-blue px-4 py-2 text-xs font-bold uppercase tracking-wide text-virtus-blue transition-colors hover:bg-virtus-blue hover:text-white"
                >
                    <Download className="h-4 w-4" /> Scarica .ics
                </a>
            </div>
        </div>
    );
}
