import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export interface CalendarEvent {
    title: string;
    date: string;
    time?: string;
    location?: string;
    category?: string;
    slug: string;
}

interface CalendarWidgetProps {
    events?: CalendarEvent[];
    teamSlug?: string;
    title?: string;
    showCalendarLink?: boolean;
}

export default function CalendarWidget({ events, teamSlug, title = "Prossime Gare", showCalendarLink = true }: CalendarWidgetProps) {
    const calendarUrl = teamSlug ? `/calendario/${teamSlug}` : "/calendario";

    if (!events || events.length === 0) {
        return (
            <section className="bg-white rounded-lg p-6 shadow-md border-t-4 border-virtus-blue">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                    <h3 className="widget-title">
                        {title}
                    </h3>
                    <CalendarIcon className="w-5 h-5 text-virtus-gold" />
                </div>
                <div className="py-8 text-center">
                    <p className="text-gray-400 font-medium italic">Nessuna partita inserita</p>
                </div>
                {showCalendarLink && (
                    <Link
                        href={calendarUrl}
                        className="block w-full mt-6 bg-virtus-blue hover:bg-virtus-blue/90 text-white text-center py-2 rounded-md transition-colors text-xs font-bold uppercase tracking-wide"
                    >
                        Risultati e Calendario
                    </Link>
                )}
            </section>
        );
    }

    return (
        <section className="bg-white rounded-lg p-6 shadow-md border-t-4 border-virtus-blue">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="widget-title">
                    {title}
                </h3>
                <CalendarIcon className="w-5 h-5 text-virtus-gold" />
            </div>

            <div className="space-y-4">
                {events.map((event, index) => {
                    const dateObj = new Date(event.date);
                    const day = dateObj.getDate().toString().padStart(2, '0');
                    const month = dateObj.toLocaleString('it-IT', { month: 'short' }).toUpperCase().replace('.', '');

                    return (
                        <Link
                            key={index}
                            href={`/partite/${event.slug}`}
                            className="group block cursor-pointer"
                        >
                            <div className="flex gap-3 items-center">
                                {/* Date Box */}
                                <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-gray-200 group-hover:border-virtus-yellow transition-colors leading-none">
                                    <span className="text-[10px] font-bold text-gray-800">{day}</span>
                                    <span className="text-[8px] font-bold text-virtus-blue mt-0.5">{month}</span>
                                </div>

                                {/* Details */}
                                <div className="flex-grow min-w-0">
                                    {event.category && (
                                        <span className="text-[8px] font-black text-white bg-virtus-yellow px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            {event.category}
                                        </span>
                                    )}
                                    <h4 className="font-bold text-gray-800 text-sm mt-1 leading-tight group-hover:text-virtus-blue transition-colors truncate">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-medium">
                                        {event.time && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" /> {event.time}
                                            </span>
                                        )}
                                        {event.location && (
                                            <span className="flex items-center gap-1 min-w-0">
                                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {showCalendarLink && (
                <Link
                    href={calendarUrl}
                    className="block w-full mt-6 bg-virtus-blue hover:bg-virtus-blue/90 text-white text-center py-2 rounded-md transition-colors text-xs font-bold uppercase tracking-wide"
                >
                    Risultati e Calendario
                </Link>
            )}
        </section>
    );
}
