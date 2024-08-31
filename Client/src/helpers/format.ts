export function Capitalize(value: string) {
    if (value)
        return value.toLowerCase().replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
    return null;
}

export function Localize(value: Date | null): Date | null {
    if (value) {
        return new Date(value + "+00:00");
    }
    return null;
}

export function Clamp(value: number | null, min: number, max: number) {
    if (value == 0) return min;
    if (value) {
        return Math.max(min, Math.min(value, max));
    }
    return null;
}