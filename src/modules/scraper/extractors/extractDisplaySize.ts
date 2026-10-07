export const extractDisplaySize = (data: Record<string, any>): string | null => {
    const ds = data.displaySize;
    if (typeof ds === "string" && ds) return ds;

    const infoReel = data.infoReelItems;
    if (Array.isArray(infoReel)) {
        for (const item of infoReel) {
            if (item && typeof item === "object" && item.type === "SIZE" && item.primaryText) {
                return item.primaryText;
            }
        }
    }

    const sizings = data.sizings;
    if (Array.isArray(sizings) && sizings.length) {
        for (const preferred of ["sqft", "sqm"]) {
            for (const s of sizings) {
                if (s && typeof s === "object" && s.unit === preferred) {
                    const sizeVal = s.minimumSize || s.maximumSize || s.displaySize;
                    const displayUnit = s.displayUnit ?? preferred;
                    if (sizeVal) {
                        if (typeof sizeVal === "number" && sizeVal >= 1000) {
                            return `${sizeVal.toLocaleString("en-US", { maximumFractionDigits: 0 })} ${displayUnit}`.trim();
                        }
                        return `${sizeVal} ${displayUnit}`.trim();
                    }
                }
            }
        }
    }
    return null;
}