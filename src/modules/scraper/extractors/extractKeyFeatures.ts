export const extractKeyFeatures = (data: Record<string, any>): string[] => {
    const out: string[] = [];
    for (const item of data.keyFeatures ?? []) {
        if (item && typeof item === "object") {
            const desc = item.description ?? item.htmlDescription;
            if (desc) out.push(desc);
        } else if (typeof item === "string") {
            out.push(item);
        }
    }
    return out;
}