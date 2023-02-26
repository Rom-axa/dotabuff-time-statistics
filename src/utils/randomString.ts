export default function randomString(symbols: number): string {
    return (Math.random() + 1).toString(36).substring(symbols);
} 