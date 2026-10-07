import {API_BASE, TYPEAHEAD_ENDPOINT} from "../../../constants/constants.js";
import {normalisePostcodeOrOutcode} from "./normalisePostcodeOrOutcode.js";

export const lookupPostcode = async (postcode: string): Promise<string | null> => {
    const key = normalisePostcodeOrOutcode(postcode);
    const url = new URL(API_BASE + TYPEAHEAD_ENDPOINT);
    url.searchParams.set("query", key);
    url.searchParams.set("limit", "10");
    url.searchParams.set("exclude", "STREET");

    let data: { matches?: Array<{ id?: string; type?: string }> };
    try {
        const resp = await fetch(url, { signal: AbortSignal.timeout(10_000) });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        data = await resp.json();
    } catch (exc) {
        throw new Error(`Failed to lookup postcode '${postcode}': ${exc}`);
    }

    const first = data.matches?.[0];
    if (!first?.id) return null;
    return `${first.type ?? "OUTCODE"}^${first.id}`;
}