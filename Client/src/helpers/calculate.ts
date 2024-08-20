export function getTimeDifference(date1: Date, date2: Date): string {
    const difference = date2.getTime() - date1.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

export function stringToHex(username: string): string {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        const code = username.charCodeAt(i);
        hash = (hash << 5) - hash + code;
        hash |= 0;
    }
    return `${((hash >>> 0) & 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase()}`;
}

export function getContrast(hex: string): string {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 128 ? '#000000' : '#FFFFFF';
}