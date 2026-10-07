import {Page} from "../../../types/Page.js";
import {FetchOpts} from "../../../types/FetchOpts.js";
import {makeRequest} from "./makeRequest.js";
import {RetryableError} from "../errors/RetryableError.js";
import {RightmoveError} from "../errors/RightmoveError.js";

export const getWithRetries = async (url: string, opts: Required<FetchOpts>): Promise<Page> => {
    let lastErr: unknown;
    for (let attempt = 0; attempt < opts.retryAttempts; attempt++) {
        try {
            return await makeRequest(url, opts.timeout);
        } catch (exc) {
            if (!(exc instanceof RetryableError)) throw exc;
            lastErr = exc;
            if (attempt < opts.retryAttempts - 1) {
                const wait = Math.min(opts.retryBackoff * 2 ** attempt, 30_000);
                await new Promise((r) => setTimeout(r, wait));
            }
        }
    }
    throw new RightmoveError(`Request failed after ${opts.retryAttempts} retries: ${lastErr}`);
}