import {RightmoveListing} from "../../../types/RightmoveListing.js";
import {RM_BASE} from "../../../constants/constants.js";
import {fullRmUrl} from "../../../utils/fullRmUrl.js";
import {safeFloat} from "../../../utils/safeFloat.js";
import {extractImages} from "../extractors/extractImages.js";

export const listingFromNextData = (data: Record<string, any>): RightmoveListing => {
    const price = data.price ?? {};
    const propertyUrl = data.propertyUrl ?? "";
    const customer = data.customer ?? {};
    const location = data.location ?? {};
    const tags: string[] = data.tags ?? [];
    return {
        id: data.id,
        url: `${RM_BASE}${propertyUrl}`,
        price: price.amount ?? null,
        currency: price.currencyCode ?? null,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        address: data.displayAddress ?? null,
        summary: data.summary ?? null,
        propertyType: data.propertyTypeFullDescription ?? data.propertySubType ?? null,
        agentName: customer.branchDisplayName ?? null,
        agentBranch: fullRmUrl(customer.branchLandingPageUrl),
        firstVisibleDate: data.firstVisibleDate ?? null,
        images: extractImages(data),
        latitude: safeFloat(location.latitude),
        longitude: safeFloat(location.longitude),
        listingStatus: tags.length ? tags[0] : null,
        tags,
        letAvailableDate: data.letAvailableDate ?? null,
        priceFrequency: price.frequency ?? null,
        students: data.students ?? null,
        transactionType: data.transactionType ?? null,
        raw: data,
    };
}