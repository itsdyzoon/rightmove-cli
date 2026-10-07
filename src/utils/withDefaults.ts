import {FetchOpts} from "../types/FetchOpts.js";

export const withDefaults = (opts: FetchOpts): Required<FetchOpts> => ({
    timeout: opts.timeout ?? 15_000,
    retryAttempts: opts.retryAttempts ?? 3,
    retryBackoff: opts.retryBackoff ?? 1_500,
});