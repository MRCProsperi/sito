// Match times in the data are Italian local times. Convert them to a real instant so countdowns
// are right for visitors in any time zone (and across the daylight saving change).
function lastSundayUtc(year: number, monthIndex: number): number {
    const d = new Date(Date.UTC(year, monthIndex + 1, 0, 1, 0, 0)); // last day of month, 01:00 UTC
    d.setUTCDate(d.getUTCDate() - d.getUTCDay());
    return d.getTime();
}

export function romeTimestamp(date: string, time?: string): number {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = (time || '00:00').split(':').map(Number);
    const asUtc = Date.UTC(y, m - 1, d, hh || 0, mm || 0);
    const dstStart = lastSundayUtc(y, 2);
    const dstEnd = lastSundayUtc(y, 9);
    const offsetHours = asUtc - 2 * 3600_000 >= dstStart && asUtc - 2 * 3600_000 < dstEnd ? 2 : 1;
    return asUtc - offsetHours * 3600_000;
}
