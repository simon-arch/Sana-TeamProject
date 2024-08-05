export function Capitalize(value: string) {
    if (value)
        return value.toLowerCase().replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
    return null;
}