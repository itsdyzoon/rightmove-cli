export class UnsafeURLError extends Error {}

// Backslashes and raw whitespace/control characters are the classic way two URL
// parsers disagree about where the authority ends. Reject them outright rather
// than model every parser's normalisation.
const DISALLOWED_CHARS = new Set(
    "\\ \t\n\r\x0b\x0c\x00\x01\x02\x03\x04\x05\x06\x07\x08" +
    "\x0e\x0f\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f\x7f",
);

export const validateAllowedUrl = (url: string, allowedHosts: Set<string>): string => {
    if (typeof url !== "string" || !url) {
        throw new UnsafeURLError("URL must be a non-empty string");
    }

    // Runs before new URL(), matching the Python order, so the two parsers agree
    // on what is rejected.
    const bad = [...url].filter((c) => DISALLOWED_CHARS.has(c));
    if (bad.length) {
        throw new UnsafeURLError(`URL contains disallowed characters: ${JSON.stringify(bad)}`);
    }

    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch (exc) {
        throw new UnsafeURLError(`URL could not be parsed: ${exc}`);
    }

    if (parsed.protocol !== "https:") {
        throw new UnsafeURLError(`URL scheme must be https, got ${parsed.protocol.replace(/:$/, "")}`);
    }
    if (parsed.username || parsed.password) {
        throw new UnsafeURLError("URL must not contain userinfo (user:pass@host)");
    }
    // WHATWG URL strips the port when it equals the scheme default (443 for
    // https), so a non-empty port here is always a non-default one.
    if (parsed.port !== "") {
        throw new UnsafeURLError(`URL port must be the https default, got ${parsed.port}`);
    }

    const hostname = parsed.hostname.toLowerCase();
    if (!hostname || !allowedHosts.has(hostname)) {
        throw new UnsafeURLError(`Host ${JSON.stringify(parsed.hostname)} is not allowlisted`);
    }

    // Rebuild from validated parts only; the fragment is dropped (never sent to
    // the server) and the port left implicit.
    return `https://${hostname}${parsed.pathname || "/"}${parsed.search}`;
}
