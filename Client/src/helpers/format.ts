export function Capitalize(value: string) {
    return value.toLowerCase().replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}