export const safeInt = (val: any): number | null => {
    if (val === null || val === undefined || val === "") return null;
    const n = Number(val);
    return Number.isFinite(n) ? Math.trunc(n) : null;
}