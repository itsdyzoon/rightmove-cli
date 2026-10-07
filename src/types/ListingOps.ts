import {FetchOpts} from "./FetchOpts.js";

export type ListingsOpts = FetchOpts & {
    maxPages?: number | null;
    rateLimitSeconds?: number;
};
