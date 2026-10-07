import {PROPERTY_ID_RE, PROPERTY_PATH_RE, RIGHTMOVE_HOSTS, RM_BASE} from "../../constants/constants.js";
import {validateAllowedUrl} from "../../utils/validateAllowedUrl.js";

export const extractPropertyId = (propertyIdOrUrl: string): string => {
    const value = (propertyIdOrUrl ?? "").trim();
    if (PROPERTY_ID_RE.test(value)) return value;

    if (value.includes("//") || /^https?:/i.test(value)) {
        // A URL is only ever a source of digits — the fetched URL is rebuilt
        // internally, so this cannot reach an arbitrary host.
        const canonical = validateAllowedUrl(value, RIGHTMOVE_HOSTS);
        const match = new URL(canonical).pathname.match(PROPERTY_PATH_RE);
        if (match) return match[1];
        throw new Error(
            `Not a Rightmove listing URL: ${JSON.stringify(propertyIdOrUrl)}. ` +
            `Expected ${RM_BASE}/properties/<numeric id>.`,
        );
    }

    throw new Error(
        `Expected a numeric Rightmove property ID (1-12 digits) or a ` +
        `${RM_BASE}/properties/<id> URL, got ${JSON.stringify(propertyIdOrUrl)}.`,
    );
}