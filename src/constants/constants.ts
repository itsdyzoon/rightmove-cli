export const RM_BASE = "https://www.rightmove.co.uk";
export const RIGHTMOVE_HOSTS = new Set(["www.rightmove.co.uk"]);

export const API_BASE = "https://los.rightmove.co.uk";
export const TYPEAHEAD_ENDPOINT = "/typeahead";

export const PROPERTY_ID_RE = /^[0-9]{1,12}$/;
export const PROPERTY_PATH_RE = /^\/properties\/([0-9]{1,12})\/?$/;
export const NEXT_DATA_RE = /<script id="__NEXT_DATA__"[^>]*>(.+?)<\/script>/s;
export const PAGE_MODEL_RE = /window\.__PAGE_MODEL\s*=\s*(.+);/;

export const SORT_TYPES: Record<string, number> = {
    newest: 6,
    oldest: 10,
    price_low: 2,
    price_high: 12,
    most_reduced: 4,
};

// PPD property type codes → Rightmove propertyTypes param values.
export const BUILDING_TYPES: Record<string, string> = {
    F: "flat",
    D: "detached",
    S: "semi-detached",
    T: "terraced",
};

export const PROPERTY_TYPES: Record<string, string> = {
    sale: "property-for-sale",
    rent: "property-to-rent",
};

export const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;
export const MAX_REDIRECTS = 5;
export const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

export const DEFAULT_HEADERS: Record<string, string> = {
    "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    "Accept-Language": "en-GB,en;q=0.9",
};
