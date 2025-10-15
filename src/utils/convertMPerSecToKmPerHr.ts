export function convertMPerSecToKmPerHr(metersPerSec: number): string {
    return `${(metersPerSec * 3.6).toFixed(1)} km/h`;
}