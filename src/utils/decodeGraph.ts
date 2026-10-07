export const decodeGraph = (nodes: any[], idx: number, seen: Set<number> = new Set()): any => {
    if (seen.has(idx)) return null;
    const val = nodes[idx];
    const next = new Set(seen).add(idx);
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(val)) out[k] = decodeGraph(nodes, v as number, next);
        return out;
    }
    if (val && Array.isArray(val)) return val.map((i) => decodeGraph(nodes, i, next));
    return val;
}