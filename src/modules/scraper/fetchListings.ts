import {RightmoveListing} from "../../types/RightmoveListing.js";
import {ListingsOpts} from "../../types/ListingOps.js";
import {validateAllowedUrl} from "../../utils/validateAllowedUrl.js";
import {RIGHTMOVE_HOSTS} from "../../constants/constants.js";
import {getWithRetries} from "./parts/getWithRetries.js";
import {withDefaults} from "../../utils/withDefaults.js";
import {extractSearchResults} from "./extractors/extractSearchResults.js";
import {listingFromNextData} from "./parts/listingFromNextData.js";
import {urlWithIndex} from "../../utils/urlWithIndex.js";

export const fetchListings = async (
    searchUrl: string,
    opts: ListingsOpts = {},
): Promise<RightmoveListing[]> => {
    // Rebind to canonical form — everything below fetches this, never the raw
    // input, so validated and requested URLs cannot diverge.
    searchUrl = validateAllowedUrl(searchUrl, RIGHTMOVE_HOSTS);
    const fetchOpts = withDefaults(opts);
    const maxPages = opts.maxPages ?? null;
    const rateLimitMs = (opts.rateLimitSeconds ?? 0.6) * 1000;

    const listings: RightmoveListing[] = [];
    let nextUrl: string | null = searchUrl;
    let pageCounter = 0;
    const seenIndices = new Set<string>();

    while (nextUrl) {
        if (rateLimitMs && pageCounter > 0) await new Promise((r) => setTimeout(r, rateLimitMs));
        pageCounter++;

        const page = await getWithRetries(nextUrl, fetchOpts);
        const searchResults = extractSearchResults(page.text);
        const properties: any[] = searchResults.properties ?? [];
        for (const prop of properties) listings.push(listingFromNextData(prop));

        const nextIndex = (searchResults.pagination ?? {}).next;

        if (maxPages !== null && pageCounter >= maxPages) break;
        if (!nextIndex || seenIndices.has(String(nextIndex))) break;

        seenIndices.add(String(nextIndex));
        // Rewrites only the `index` param on the validated URL, so the host cannot
        // change; re-validated anyway.
        nextUrl = validateAllowedUrl(urlWithIndex(searchUrl, nextIndex), RIGHTMOVE_HOSTS);
    }

    return listings;
}