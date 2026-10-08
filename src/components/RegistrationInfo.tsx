import { SEASON } from "@/lib/site";

type Kind = "minibasket" | "basket";

const CONTENT: Record<Kind, { title: string; pdf: string; form: string; intro: string; categories: { name: string; years: string }[] }> = {
    minibasket: {
        title: "Iscrizione Minibasket",
        pdf: "/pdf/modulo-iscrizione-minibasket-26-27.pdf",
        form: "1FAIpQLSdMGWnLCSznwbMMcTAgPp7aTT_1Fn9K09QY_hd4ecioFDCqag",
        intro: "Corsi di minibasket per bambini e bambine dai 5 agli 11 anni.",
        categories: [
            { name: "Pulcini", years: "nati nel 2021 e 2020" },
            { name: "Scoiattoli", years: "nati nel 2019 e 2018" },
            { name: "Aquilotti", years: "nati nel 2017 e 2016" },
            { name: "Esordienti", years: "nati nel 2015" },
        ],
    },
    basket: {
        title: "Iscrizione Basket",
        pdf: "/pdf/modulo-iscrizione-basket-26-27.pdf",
        form: "1FAIpQLSclMkryREEnK-1zXzk6Rlv4e9qnLUUSGfBZUs90EE5KlCk48A",
        intro: "Squadre giovanili Under 13, 14, 15-16 e 17.",
        categories: [
            { name: "Under 13", years: "nati nel 2015 e 2014" },
            { name: "Under 14", years: "nati nel 2014 e 2013" },
            { name: "Under 15 - Under 16", years: "nati nel 2013 e 2012" },
            { name: "Under 17", years: "nati nel 2012, 2011 e 2010" },
            { name: "Progetto Basket", years: "nati dal 2014 al 2010, attività non agonistica" },
        ],
    },
};


const PLACES = ["Liceo Landi", "Palestra Polivalente", "Andrea Velletrano"];

const card = "bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8";
const h2 = "text-2xl font-display font-bold text-virtus-blue uppercase tracking-tight mb-4 flex items-center";

export default function RegistrationInfo({ type }: { type: Kind }) {
    const c = CONTENT[type];
    return (
        <div className="print:hidden max-w-4xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 space-y-6">
            <header className="text-center">
                <h1 className="text-3xl md:text-5xl font-display font-bold text-virtus-blue tracking-tight">
                    {c.title} {SEASON}
                </h1>
                <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
                    {c.intro} Questo è il modulo di iscrizione per la stagione sportiva {SEASON}. Compila il form online:
                    riceverai per email il modulo già compilato, da consegnare a mano in segreteria oppure da rispedire via email.
                </p>
                <a
                    href="#modulo"
                    className="inline-block mt-6 px-6 py-3 bg-virtus-yellow text-virtus-blue font-bold uppercase tracking-wider rounded-lg hover:shadow-lg transition-shadow"
                >
                    Vai al modulo
                </a>
                <p className="mt-4 text-sm text-gray-600">
                    Preferisci la carta?{" "}
                    <a className="font-bold text-virtus-blue underline" href={c.pdf} target="_blank" rel="noopener noreferrer">
                        Scarica il modulo PDF
                    </a>
                </p>
            </header>

            <section className={card}>
                <h2 className={h2}><span className="w-2 h-8 bg-virtus-yellow mr-4" />Categorie</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs uppercase tracking-wider text-gray-400">
                            <th className="py-2 pr-4">Categoria</th>
                            <th className="py-2">Annate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {c.categories.map((row) => (
                            <tr key={row.name} className="border-t border-gray-100">
                                <td className="py-3 pr-4 font-bold text-virtus-blue uppercase">{row.name}</td>
                                <td className="py-3 text-gray-700">{row.years}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className={card}>
                <h2 className={h2}><span className="w-2 h-8 bg-virtus-yellow mr-4" />Dove si allena</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                    {PLACES.map((p) => (
                        <li key={p} className="font-medium">{p}</li>
                    ))}
                </ul>
                <p className="mt-3 text-sm text-gray-500">Gli orari definitivi non sono ancora disponibili.</p>
            </section>

            <section className={card}>
                <h2 className={h2}><span className="w-2 h-8 bg-virtus-yellow mr-4" />Come iscriversi</h2>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    <li>Compila il modulo online qui sotto, uno per ogni figlio.</li>
                    <li>Ricevi per email il modulo di iscrizione già compilato.</li>
                    <li>Stampalo e firma i riquadri previsti.</li>
                    <li>
                        Consegnalo in segreteria a mano, oppure inviane una foto su WhatsApp al <strong>388 753 3635</strong>.
                    </li>
                    <li>Allega il documento d&apos;identità dell&apos;iscritto e il certificato medico, se già li hai.</li>
                </ol>
                <p className="mt-4 text-gray-700">
                    Il certificato medico per attività sportiva non agonistica va consegnato entro 15 giorni dall&apos;iscrizione.
                    Per i nuovi iscritti servono anche una copia del documento d&apos;identità e del codice fiscale, necessari
                    per il tesseramento.
                </p>
            </section>

            <section className={card}>
                <h2 className={h2}><span className="w-2 h-8 bg-virtus-yellow mr-4" />Pagamento con bonifico</h2>
                <p className="text-gray-700">
                    Puoi anticipare il pagamento con bonifico, indicando nella causale il nome dell&apos;atleta. In quel caso
                    invia anche la ricevuta per email.
                </p>
                <dl className="mt-4 bg-gray-50 rounded-xl p-4 text-sm space-y-1">
                    <div><dt className="inline font-bold text-virtus-blue">IBAN: </dt><dd className="inline font-mono">IT 82 Y 05104 39499 CC001 0520 114</dd></div>
                    <div><dt className="inline font-bold text-virtus-blue">Intestato a: </dt><dd className="inline">VIRTUS VELLETRI SOCIETÀ SPORTIVA DILETTANTISTICA A R.L.</dd></div>
                    <div><dt className="inline font-bold text-virtus-blue">Causale: </dt><dd className="inline">Nome dell&apos;atleta</dd></div>
                </dl>
            </section>

            <section className="rounded-2xl p-6 md:p-8 bg-virtus-blue text-white">
                <h2 className="text-xl font-display font-bold uppercase tracking-tight mb-2">Voucher Sport Regione Lazio</h2>
                <p>in attesa di rifinanziamento.</p>
            </section>

            <section id="modulo" className={`${card} scroll-mt-24`}>
                <h2 className={h2}><span className="w-2 h-8 bg-virtus-yellow mr-4" />Modulo di iscrizione</h2>
                <p className="text-gray-700 mb-4">Compila un modulo per ogni figlio. Ci vogliono cinque minuti.</p>
                <iframe
                    src={`https://docs.google.com/forms/d/e/${c.form}/viewform?embedded=true`}
                    title={`Modulo ${c.title}`}
                    className="w-full border-0"
                    style={{ height: "1800px" }}
                    loading="lazy"
                >
                    Caricamento…
                </iframe>
                <p className="mt-4 text-sm text-gray-600">
                    Se il modulo non si carica,{" "}
                    <a
                        className="font-bold text-virtus-blue underline"
                        href={`https://docs.google.com/forms/d/e/${c.form}/viewform`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        aprilo in una nuova pagina
                    </a>
                    .
                </p>
            </section>

            <section className={card}>
                <h2 className={h2}><span className="w-2 h-8 bg-virtus-yellow mr-4" />Contatti</h2>
                <ul className="space-y-1 text-gray-700">
                    <li><strong>Telefono e WhatsApp:</strong> <a className="text-virtus-blue underline" href="tel:+393887533635">388 7533635</a></li>
                    <li><strong>Segreteria:</strong> Via Ponte di Ferro 38, 00049 Velletri (RM)</li>
                </ul>
            </section>
        </div>
    );
}
