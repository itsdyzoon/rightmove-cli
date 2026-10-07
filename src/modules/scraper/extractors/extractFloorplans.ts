export const extractFloorplans = (data: Record<string, any>): string[] => {
    const out: string[] = [];
    for (const fp of data.floorplans ?? []) {
        if (fp && typeof fp === "object") {
            const url = fp.url ?? fp.src;
            if (url) out.push(url);
        }
    }
    return out;
}