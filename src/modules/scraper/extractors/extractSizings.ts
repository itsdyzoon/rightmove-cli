export const extractSizings = (data: Record<string, any>): [number | null, number | null] => {
    const sizings = data.sizings;
    if (!Array.isArray(sizings)) return [null, null];
    let sqm: number | null = null;
    let sqft: number | null = null;
    for (const s of sizings) {
        if (!s || typeof s !== "object") continue;
        const size = s.minimumSize != null ? s.minimumSize : s.maximumSize;
        if (size == null) continue;
        if (s.unit === "sqm" && sqm === null) sqm = Number(size);
        else if (s.unit === "sqft" && sqft === null) sqft = Number(size);
    }
    return [sqm, sqft];
}