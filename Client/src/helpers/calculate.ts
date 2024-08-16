export function getTimeDifference(date1: Date, date2: Date): string {
    const difference = date2.getTime() - date1.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    else if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    else if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    else return `${seconds} second${seconds > 1 ? 's' : ''}`;
}