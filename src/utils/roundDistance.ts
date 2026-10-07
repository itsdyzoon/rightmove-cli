export const roundDistance = (val: any): number | null => {
    if (val === null || val === undefined) return null;
    const n = Number(val);
    if (!Number.isFinite(n)) return null;
    return Math.round(n * 10) / 10;
}