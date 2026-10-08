"use client";

import { useEffect, useRef, useState } from "react";
import { Send, CheckCircle2, AlertCircle, ChevronDown, Check } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const CUT = "[clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]";

const TIPI = ["Sito vetrina", "Restyling di un sito esistente", "Altro"];

// Custom dropdown: native <select> highlights options with the OS blue, which cannot be themed.
function TipoSelect({ id, className }: { id: string; className: string }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(TIPI[0]);
    const [active, setActive] = useState(0);
    const box = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    function choose(i: number) { setValue(TIPI[i]); setActive(i); setOpen(false); }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Escape") { setOpen(false); return; }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) { setOpen(true); return; }
            setActive((a) => (e.key === "ArrowDown" ? Math.min(a + 1, TIPI.length - 1) : Math.max(a - 1, 0)));
        } else if ((e.key === "Enter" || e.key === " ") && open) {
            e.preventDefault();
            choose(active);
        }
    }

    return (
        <div ref={box} className="relative" onKeyDown={onKeyDown}>
            <input type="hidden" name="tipo" value={value} />
            <button
                type="button"
                id={id}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => { setOpen((o) => !o); setActive(TIPI.indexOf(value)); }}
                className={`${className} flex items-center justify-between text-left`}
            >
                <span>{value}</span>
                <ChevronDown className={`h-4 w-4 text-[#f5a524] transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <ul role="listbox" aria-labelledby={id} className="absolute z-20 mt-1 w-full border border-[#f5a524]/50 bg-[#26282c] shadow-xl">
                    {TIPI.map((t, i) => (
                        <li
                            key={t}
                            role="option"
                            aria-selected={t === value}
                            onMouseEnter={() => setActive(i)}
                            onClick={() => choose(i)}
                            className={`flex cursor-pointer items-center justify-between px-4 py-3 text-[#f3ead8] ${i === active ? "bg-[#f5a524]/20" : ""} ${t === value ? "font-bold text-[#f5a524]" : ""}`}
                        >
                            {t}
                            {t === value && <Check className="h-4 w-4" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function BatlhContactForm() {
    const [loadedAt] = useState(() => Date.now());
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        data.set("t", String(loadedAt));
        setStatus("sending");
        setError("");
        try {
            const res = await fetch("/batlh-contatti.php", { method: "POST", body: data });
            const json = await res.json().catch(() => null);
            if (res.ok && json?.ok) {
                setStatus("sent");
                form.reset();
            } else {
                setError(json?.error || "Invio non riuscito. Riprova più tardi.");
                setStatus("error");
            }
        } catch {
            setError("Impossibile inviare il messaggio. Controlla la connessione e riprova.");
            setStatus("error");
        }
    }

    const field = "w-full border border-[#f3ead8]/15 bg-black/25 px-4 py-3 text-[#f3ead8] placeholder-[#f3ead8]/30 focus:border-[#f5a524] focus:outline-none focus:ring-1 focus:ring-[#f5a524]";
    const label = "mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-[#f5a524]";

    if (status === "sent") {
        return (
            <div className="border border-[#f5a524]/60 bg-[#f5a524]/10 p-6 flex items-start gap-3" role="status">
                <CheckCircle2 className="w-6 h-6 text-[#f5a524] shrink-0 mt-0.5" />
                <div>
                    <p className="font-black uppercase tracking-widest text-[#f3ead8]">Messaggio ricevuto</p>
                    <p className="text-[#f3ead8]/70 text-sm">Grazie! Ti rispondo il prima possibile.</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {/* Honeypot: hidden from people, filled by bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>Non compilare questo campo<input type="text" name="sito" tabIndex={-1} autoComplete="off" /></label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="bs-nome" className={label}>Nome</label>
                    <input id="bs-nome" name="nome" type="text" required minLength={2} maxLength={80} autoComplete="name" className={field} />
                </div>
                <div>
                    <label htmlFor="bs-email" className={label}>Email</label>
                    <input id="bs-email" name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
                </div>
            </div>
            <div>
                <label id="bs-tipo-label" htmlFor="bs-tipo" className={label}>Che sito ti serve?</label>
                <TipoSelect id="bs-tipo" className={field} />
            </div>
            <div>
                <label htmlFor="bs-messaggio" className={label}>Raccontami il progetto</label>
                <textarea id="bs-messaggio" name="messaggio" required minLength={10} maxLength={2000} rows={6} className={field} placeholder="Di cosa ti occupi, cosa deve fare il sito, entro quando ti serve…" />
            </div>
            <label className="flex items-start gap-3 text-sm text-[#f3ead8]/60">
                <input type="checkbox" name="consenso" value="1" required className="mt-1 h-4 w-4 accent-[#f5a524]" />
                <span>Acconsento al trattamento dei miei dati per essere ricontattato in merito a questa richiesta.</span>
            </label>

            {status === "error" && (
                <div className="flex items-start gap-2 border border-red-500/60 bg-red-500/10 p-3 text-sm text-red-200" role="alert">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" /> {error}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "sending"}
                className={`${CUT} inline-flex items-center gap-3 bg-[#f5a524] px-8 py-4 font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#f3ead8] hover:text-black disabled:opacity-60`}
            >
                <Send className="w-4 h-4" /> {status === "sending" ? "Invio…" : "Invia la richiesta"}
            </button>
        </form>
    );
}
