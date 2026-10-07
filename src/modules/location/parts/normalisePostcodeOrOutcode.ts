export class InvalidPostcodeError extends Error {}

const OUTCODE = "[A-Z]{1,2}[0-9][A-Z0-9]?";
const INCODE = "[0-9][A-Z]{2}";

const OUTCODE_RE = new RegExp(`^${OUTCODE}$`);
const SECTOR_RE = new RegExp(`^${OUTCODE} [0-9]$`);
const FULL_RE = new RegExp(`^${OUTCODE} ${INCODE}$`);

// GIR 0AA (Girobank, Bootle) is the only postcode in the GIR outcode; the
// special cases are exact so GIR 1ZZ / the sector GIR 9 are not admitted.
const GIR_OUTCODE = "GIR";
const GIR_SECTOR = "GIR 0";
const GIR_FULL = "GIR 0AA";

const isOutcode = (t: string) => t === GIR_OUTCODE || OUTCODE_RE.test(t);
const isSector = (t: string) => t === GIR_SECTOR || SECTOR_RE.test(t);
const isFull = (t: string) => t === GIR_FULL || FULL_RE.test(t);

// Any control char means the input is not a postcode a human typed; normalising
// a newline into a space would silently accept "B5\n7" as the sector "B5 7".
const CONTROL = new Set("\x00\t\n\r\x0b\x0c");

const normalise = (value: unknown): string => {
    if (typeof value !== "string") return "";
    if ([...value].some((c) => CONTROL.has(c))) return "";
    return value.trim().toUpperCase().split(/\s+/).join(" ");
}

export const normalisePostcodeOrOutcode = (value: unknown): string => {
    const text = normalise(value);
    if (isFull(text) || isOutcode(text)) return text;

    let expected = "a full postcode ('B5 4BX') or an outcode ('B5')";
    if (isSector(text)) {
        const outcode = text.split(" ")[0];
        expected += `; a postcode sector has no Rightmove location -- use the outcode '${outcode}' or a full postcode`;
    }
    const shown = typeof value === "string" ? value : JSON.stringify(value);
    throw new InvalidPostcodeError(`Invalid postcode '${shown}': expected ${expected}`);
}
