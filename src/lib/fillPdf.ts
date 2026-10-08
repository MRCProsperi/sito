import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export type FormType = 'basket' | 'minibasket';

const TEMPLATES: Record<FormType, string> = {
    basket: '/pdf/modulo-iscrizione-basket-25-26.pdf',
    minibasket: '/pdf/modulo-iscrizione-minibasket-25-26.pdf',
};

const MAX_FIELD_LENGTH = 120;

// Fields written on the PDF template. Origin is bottom-left (A4 points).
type Field = { x: number; y: number; transform?: (v: string) => string };
const upper = (v: string) => v.toUpperCase();

const FIELDS: Record<string, Field> = {
    nomeAtleta: { x: 120, y: 697 },
    cognomeAtleta: { x: 380, y: 697 },
    luogoNascita: { x: 120, y: 656 },
    dataNascita: { x: 390, y: 656 },
    cittadinanza: { x: 150, y: 614 },
    cittaAtleta: { x: 160, y: 582 },
    provAtleta: { x: 470, y: 582, transform: upper },
    indirizzoAtleta: { x: 160, y: 560 },
    codiceFiscaleAtleta: { x: 210, y: 528, transform: upper },
    codiceFiscaleGenitore: { x: 100, y: 450, transform: upper },
    telefono: { x: 360, y: 450 },
    email: { x: 120, y: 420 },
};
const PARENT_NAME = { x: 160, y: 477 };

function clean(value: unknown): string {
    if (typeof value !== 'string') return '';
    // Helvetica (WinAnsi) can't encode everything: drop control chars and anything outside Latin-1.
    // eslint-disable-next-line no-control-regex
    return value.replace(/[\u0000-\u001f\u007f]|[^\u0000-ÿ]/g, '').trim().slice(0, MAX_FIELD_LENGTH);
}

/** Fills the registration PDF entirely in the browser: personal data never leaves the device. */
export async function fillRegistrationPdf(formType: FormType, data: Record<string, unknown>): Promise<Uint8Array> {
    const response = await fetch(TEMPLATES[formType]);
    if (!response.ok) throw new Error(`Template PDF non disponibile (${response.status})`);

    const pdf = await PDFDocument.load(await response.arrayBuffer());
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const page = pdf.getPage(0);

    const draw = (text: string, x: number, y: number) => {
        if (text) page.drawText(text, { x, y, size: 10, font, color: rgb(0, 0, 0) });
    };

    for (const [name, { x, y, transform }] of Object.entries(FIELDS)) {
        const value = clean(data[name]) || (name === 'cittadinanza' ? 'Italiana' : '');
        draw(transform ? transform(value) : value, x, y);
    }
    draw(`${clean(data.nomeGenitore)} ${clean(data.cognomeGenitore)}`.trim(), PARENT_NAME.x, PARENT_NAME.y);

    return pdf.save();
}
