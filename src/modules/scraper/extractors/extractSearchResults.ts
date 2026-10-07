import {NEXT_DATA_RE} from "../../../constants/constants.js";
import {RightmoveError} from "../errors/RightmoveError.js";

export const extractSearchResults = (html: string): Record<string, any> => {
    const raw = html.match(NEXT_DATA_RE)?.[1];
    if (!raw) throw new RightmoveError("Could not locate embedded search data on the page");
    let parsed: any;
    try {
        parsed = JSON.parse(raw);
    } catch (exc) {
        throw new RightmoveError(`Page contained invalid JSON: ${exc}`);
    }
    const results = parsed?.props?.pageProps?.searchResults;
    if (results === undefined) {
        throw new RightmoveError("Search results were not present in the page payload");
    }
    return results;
}