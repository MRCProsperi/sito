"use client";

import React, { useState, useRef } from 'react';
import { Printer, Download, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { fillRegistrationPdf } from '@/lib/fillPdf';
import { SEASON } from '@/lib/site';

const RegistrationForm = ({ type = 'minibasket' }: { type?: 'minibasket' | 'basket' }) => {
    const isBasket = type === 'basket';
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Atleta
        cognomeAtleta: '',
        nomeAtleta: '',
        luogoNascita: '',
        dataNascita: '',
        codiceFiscaleAtleta: '',
        indirizzoAtleta: '',
        cittaAtleta: '',
        provAtleta: '',
        cittadinanza: '',
        scuola: '',
        classe: '',

        // Genitore/Tutore
        cognomeGenitore: '',
        nomeGenitore: '',
        codiceFiscaleGenitore: '',
        telefono: '',
        email: '',


    });

    const printRef = useRef<HTMLDivElement>(null);

    const toTitleCase = (str: string) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        let processedValue = value;

        const titleCaseFields = [
            'nomeAtleta', 'cognomeAtleta',
            'nomeGenitore', 'cognomeGenitore',
            'luogoNascita', 'cittadinanza',
            'cittaAtleta', 'indirizzoAtleta'
        ];
        const upperCaseFields = [
            'codiceFiscaleAtleta', 'codiceFiscaleGenitore', 'provAtleta'
        ];

        if (titleCaseFields.includes(name)) {
            processedValue = toTitleCase(value);
        } else if (upperCaseFields.includes(name)) {
            processedValue = value.toUpperCase();
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        try {
            const bytes = await fillRegistrationPdf(type, formData);
            const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `modulo-iscrizione-${formData.cognomeAtleta}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF Error:', error);
            alert('Si è verificato un errore durante la generazione del PDF pre-compilato.');
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Form UI (Visible on screen) */}
            <div className="print:hidden bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-virtus-blue p-8 text-center">
                    <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tighter mb-2">
                        Modulo Iscrizione {isBasket ? 'Basket' : 'Minibasket'}
                    </h2>
                    <p className="text-virtus-yellow font-medium italic">{isBasket ? 'Agonistica' : 'Minibasket'} - Stagione {SEASON}</p>

                    {/* Progress Bar */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-2 w-16 rounded-full transition-colors ${step >= i ? 'bg-virtus-yellow' : 'bg-white/20'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-bold text-virtus-blue flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-virtus-yellow/20 text-virtus-blue flex items-center justify-center text-sm">1</span>
                                Dati dell&apos;Atleta
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Cognome Atleta</label>
                                    <input type="text" name="cognomeAtleta" value={formData.cognomeAtleta} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="Rossi" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Nome Atleta</label>
                                    <input type="text" name="nomeAtleta" value={formData.nomeAtleta} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="Mario" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Data di Nascita</label>
                                    <input type="date" name="dataNascita" value={formData.dataNascita} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Luogo di Nascita</label>
                                    <input type="text" name="luogoNascita" value={formData.luogoNascita} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="Città di nascita" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Cittadinanza</label>
                                    <input type="text" name="cittadinanza" value={formData.cittadinanza} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="Italiana" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Codice Fiscale Atleta</label>
                                    <input type="text" name="codiceFiscaleAtleta" value={formData.codiceFiscaleAtleta} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all uppercase text-gray-900" maxLength={16} placeholder="RSSMRA80C15H501Z" />
                                </div>
                                <div className="md:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Residente a (Città)</label>
                                            <input type="text" name="cittaAtleta" value={formData.cittaAtleta} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="Roma" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Provincia</label>
                                            <input type="text" name="provAtleta" value={formData.provAtleta} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" maxLength={2} placeholder="RM" />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Indirizzo di Residenza (Via/Piazza e n°)</label>
                                    <input type="text" name="indirizzoAtleta" value={formData.indirizzoAtleta} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="Via Roma, 10" />
                                </div>
                            </div>
                            <div className="pt-6 flex justify-end">
                                <button onClick={nextStep} className="bg-virtus-blue text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-virtus-blue/90 transition-all group">
                                    Avanti <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-bold text-virtus-blue flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-virtus-yellow/20 text-virtus-blue flex items-center justify-center text-sm">2</span>
                                Dati del Genitore / Tutore
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Cognome Genitore</label>
                                    <input type="text" name="cognomeGenitore" value={formData.cognomeGenitore} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="Rossi" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Nome Genitore</label>
                                    <input type="text" name="nomeGenitore" value={formData.nomeGenitore} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="Mario" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Codice Fiscale Genitore (per detrazioni)</label>
                                    <input type="text" name="codiceFiscaleGenitore" value={formData.codiceFiscaleGenitore} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all uppercase" maxLength={16} placeholder="RSSMRA80C15H501Z" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Telefono Cellulare</label>
                                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="es. 333 1234567" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-virtus-blue outline-none transition-all text-gray-900" placeholder="es. nome@esempio.it" />
                                </div>
                            </div>
                            <div className="pt-6 flex justify-between">
                                <button onClick={prevStep} className="text-virtus-blue font-bold flex items-center gap-2 hover:bg-gray-100 px-6 py-3 rounded-xl transition-all">
                                    <ArrowLeft className="w-4 h-4" /> Indietro
                                </button>
                                <button onClick={nextStep} className="bg-virtus-blue text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-virtus-blue/90 transition-all group">
                                    Avanti <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="w-20 h-20 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-virtus-blue">Pronto per la stampa!</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Clicca il pulsante qui sotto per generare il modulo compilato.
                                Dovrai scaricarlo (o stamparlo), firmarlo e consegnarlo in segreteria, oppure inviarne una foto su WhatsApp al <strong className="text-virtus-blue">388 753 3635</strong>.
                            </p>

                            <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="bg-virtus-blue text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-virtus-blue/90 hover:scale-[1.02] transition-all shadow-xl"
                                >
                                    <Download className="w-6 h-6" /> SCARICA MODULO PRE-COMPILATO
                                </button>
                                <button onClick={prevStep} className="text-gray-400 font-bold px-10 py-5 rounded-2xl hover:bg-gray-100 transition-all uppercase text-xs tracking-widest">
                                    Modifica Dati
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="mt-12 p-4 bg-gray-50 border border-gray-100 text-[10px]">
                        <p className="font-bold mb-1">Attenzione:</p>
                        <ul className="list-disc list-inside">
                            <li>Allega fotocopia del documento di identità e codice fiscale dell&apos;atleta.</li>
                            <li>Allega certificato medico per attività sportiva (non agonistica per minibasket).</li>
                            <li>Consegna tutto in segreteria, oppure invia le foto su WhatsApp al <strong>388 753 3635</strong></li>
                        </ul>
                    </div>
                </div>

                <div className="absolute bottom-4 left-0 w-full text-center text-[8px] text-gray-400">
                    Documento generato dal sito ufficiale virtusvelletri.it - {new Date().toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
