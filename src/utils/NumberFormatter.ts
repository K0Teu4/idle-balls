export function formatNumber(num: number): string {
    if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(2) + "T";
    }
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + "B";
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(2) + "K";
    }
    return Math.floor(num).toString();
}