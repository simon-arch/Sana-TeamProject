export function Capitalize(value: string) {
    if (value)
        return value.toLowerCase().replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
    return null;
}

export function Localize(value: Date, format: 'datetime' | 'date' | 'time' = 'datetime') {
    if (value) {
        const date = new Date(value + "+00:00");
        switch (format) {
            case 'date': return date.toLocaleDateString();
            case 'time': return date.toLocaleTimeString();
            default: return date.toLocaleString();
        }
    }
    return null;
}