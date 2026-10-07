import {getWithRetries} from "./parts/getWithRetries.js";
import {RightmoveListingDetail} from "../../types/RightmoveListingDetail.js";
import {FetchOpts} from "../../types/FetchOpts.js";
import {extractPropertyId} from "./extractPropertyId.js";
import {detailFromPageModel} from "./parts/detailFromPageModel.js";
import {withDefaults} from "../../utils/withDefaults.js";
import {extractPageModel} from "./extractors/extractPageModel.js";

export const fetchListing = async (
    propertyUrlOrId: string,
    opts: FetchOpts = {},
): Promise<RightmoveListingDetail> => {
    const pid = extractPropertyId(propertyUrlOrId);
    const url = `https://www.rightmove.co.uk/properties/${pid}`;
    const page = await getWithRetries(url, withDefaults(opts));
    return detailFromPageModel(extractPageModel(page.text), page.url);
}