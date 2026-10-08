"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ variant = "contatti" }: { variant?: "contatti" | "sponsor" }) {
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
            const res = await fetch("/invia-messaggio.php", { method: "POST", body: data });
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

    const field = "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-virtus-blue focus:outline-none focus:ring-2 focus:ring-virtus-blue/30";

    if (status === "sent") {
        return (
            <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 flex items-start gap-3" role="status">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-green-800">Messaggio inviato!</p>
                    <p className="text-green-700 text-sm">Grazie, ti risponderemo il prima possibile.</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <h3 className="text-xl font-display font-bold text-virtus-blue uppercase tracking-tight">{variant === "sponsor" ? "Vuoi sostenere la Virtus?" : "Scrivici un messaggio"}</h3>
            {variant === "sponsor" && <input type="hidden" name="oggetto" value="sponsor" />}

            {/* Honeypot: hidden from people, filled by bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>Non compilare questo campo<input type="text" name="sito" tabIndex={-1} autoComplete="off" /></label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <div>
                    <label htmlFor="cf-nome" className="mb-1 block text-sm font-bold text-gray-700">Nome e cognome</label>
                    <input id="cf-nome" name="nome" type="text" required minLength={2} maxLength={80} autoComplete="name" className={field} />
                </div>
                <div>
                    <label htmlFor="cf-email" className="mb-1 block text-sm font-bold text-gray-700">La tua email</label>
                    <input id="cf-email" name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
                </div>
            </div>
            {variant === "sponsor" && (
                <div>
                    <label htmlFor="cf-azienda" className="mb-1 block text-sm font-bold text-gray-700">Azienda o attivit&agrave; (facoltativo)</label>
                    <input id="cf-azienda" name="azienda" type="text" maxLength={80} autoComplete="organization" className={field} />
                </div>
            )}
            <div>
                <label htmlFor="cf-messaggio" className="mb-1 block text-sm font-bold text-gray-700">Messaggio</label>
                <textarea id="cf-messaggio" name="messaggio" required minLength={10} maxLength={2000} rows={6} className={field} />
            </div>
            <label className="flex items-start gap-3 text-sm text-gray-600">
                <input type="checkbox" name="consenso" value="1" required className="mt-1 h-4 w-4" />
                <span>Ho letto l&apos;<Link href="/privacy" className="text-virtus-blue underline">informativa privacy</Link> e acconsento al trattamento dei dati per rispondere alla mia richiesta.</span>
            </label>

            {status === "error" && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                    <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                </div>
            )}

            <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-lg bg-virtus-blue px-6 py-3 font-bold uppercase tracking-wide text-white transition-colors hover:bg-virtus-blue/90 disabled:opacity-60"
            >
                <Send className="w-4 h-4" /> {status === "sending" ? "Invio in corso…" : "Invia messaggio"}
            </button>
        </form>
    );
}
