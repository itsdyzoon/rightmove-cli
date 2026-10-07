import {Page} from "../../../types/Page.js";
import {DEFAULT_HEADERS, MAX_REDIRECTS, REDIRECT_STATUSES, RIGHTMOVE_HOSTS} from "../../../constants/constants.js";
import {validateAllowedUrl} from "../../../utils/validateAllowedUrl.js";
import {readCapped} from "./readCapped.js";
import {RetryableError} from "../errors/RetryableError.js";
import {RightmoveError} from "../errors/RightmoveError.js";

export const makeRequest = async (url: string, timeout: number): Promise<Page> => {
    let current = url;
    for (let i = 0; i <= MAX_REDIRECTS; i++) {
        let resp: Response;
        try {
            resp = await fetch(current, {
                headers: DEFAULT_HEADERS,
                redirect: "manual",
                signal: AbortSignal.timeout(timeout),
            });
        } catch (exc) {
            throw new RetryableError(`Network error: ${exc}`);
        }

        const status = resp.status;
        if (REDIRECT_STATUSES.has(status)) {
            const location = resp.headers.get("location");
            if (!location) throw new RightmoveError(`Redirect ${status} with no Location header`);
            // Resolve relative/protocol-relative targets against the current URL,
            // then re-validate: '//evil.example/x' resolves to a different host and
            // is rejected here.
            current = validateAllowedUrl(new URL(location, current).toString(), RIGHTMOVE_HOSTS);
            continue;
        }

        if (status === 429 || status >= 500) throw new RetryableError(`Server responded with ${status}`);
        if (status >= 400) throw new RightmoveError(`Request failed with status code ${status}`);

        return { text: await readCapped(resp), url: current };
    }
    throw new RightmoveError(`Exceeded ${MAX_REDIRECTS} redirects starting from ${url}`);
}