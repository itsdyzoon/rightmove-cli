import {MAX_RESPONSE_BYTES} from "../../../constants/constants.js";
import {RightmoveError} from "../errors/RightmoveError.js";

export const readCapped = async (resp: Response): Promise<string> => {
    const declared = resp.headers.get("content-length");
    if (declared) {
        const n = Number(declared);
        if (Number.isFinite(n) && n > MAX_RESPONSE_BYTES) {
            throw new RightmoveError(
                `Response declares ${n} bytes, over the ${MAX_RESPONSE_BYTES} byte limit`,
            );
        }
    }
    if (!resp.body) return "";

    const decoder = new TextDecoder("utf-8");
    let total = 0;
    let out = "";
    for await (const chunk of resp.body as unknown as AsyncIterable<Uint8Array>) {
        total += chunk.length;
        if (total > MAX_RESPONSE_BYTES) {
            throw new RightmoveError(
                `Response exceeded the ${MAX_RESPONSE_BYTES} byte limit while streaming`,
            );
        }
        out += decoder.decode(chunk, { stream: true });
    }
    out += decoder.decode();
    return out;
}