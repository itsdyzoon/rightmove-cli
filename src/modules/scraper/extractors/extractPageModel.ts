import {PAGE_MODEL_RE} from "../../../constants/constants.js";
import {RightmoveError} from "../errors/RightmoveError.js";
import {decodeGraph} from "../../../utils/decodeGraph.js";

export const extractPageModel = (html: string): Record<string, any> => {
    const match = html.match(PAGE_MODEL_RE);
    if (!match) throw new RightmoveError("Could not locate PAGE_MODEL data on the property page");
    let nodes: any[];
    try {
        const outer = JSON.parse(match[1]);
        nodes = JSON.parse(outer.data);
    } catch (exc) {
        throw new RightmoveError(`PAGE_MODEL contained invalid JSON: ${exc}`);
    }
    const root = decodeGraph(nodes, 0);
    const propertyData = root?.propertyData;
    if (!propertyData) throw new RightmoveError("propertyData not found in PAGE_MODEL");
    return propertyData;
}