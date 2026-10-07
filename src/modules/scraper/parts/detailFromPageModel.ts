import {safeInt} from "../../../utils/safeInt.js";
import {RightmoveListingDetail} from "../../../types/RightmoveListingDetail.js";
import {roundDistance} from "../../../utils/roundDistance.js";
import {extractSizings} from "../extractors/extractSizings.js";
import {extractImages} from "../extractors/extractImages.js";
import {extractFloorplans} from "../extractors/extractFloorplans.js";
import {safeFloat} from "../../../utils/safeFloat.js";
import {extractDisplaySize} from "../extractors/extractDisplaySize.js";
import {extractKeyFeatures} from "../extractors/extractKeyFeatures.js";

export const detailFromPageModel = (data: Record<string, any>, url: string): RightmoveListingDetail => {
    const priceInfo = data.prices ?? {};
    const primaryPrice: string = priceInfo.primaryPrice ?? priceInfo.displayPrice ?? "";
    let priceAmount = safeInt(priceInfo.amount);
    if (priceAmount === null) {
        const digits = primaryPrice.replace(/\D/g, "");
        priceAmount = digits ? parseInt(digits, 10) : null;
    }

    const location = data.location ?? {};
    const tenure = data.tenure ?? {};
    const livingCosts = data.livingCosts ?? {};
    const customer = data.customer ?? {};

    const addressInfo = data.address ?? {};
    const displayAddress = addressInfo.displayAddress ?? data.displayAddress ?? null;
    const outcode = addressInfo.outcode;
    const incode = addressInfo.incode;
    const postcode = outcode && incode ? `${outcode} ${incode}` : null;

    const text = data.text ?? {};
    const description = text.description ?? text.propertyPhrase ?? null;

    const channel = (data.channel ?? "").toLowerCase();
    const transactionType = channel === "rent" ? "rent" : channel === "buy" ? "buy" : null;

    const listingHistory = data.listingHistory ?? {};
    const tags: string[] = data.tags ?? [];

    const nearestStations = (data.nearestStations ?? [])
        .filter((s: any) => s && typeof s === "object")
        .map((s: Record<string, any>) => ({
            name: s.name,
            types: s.types ?? [],
            distance: roundDistance(s.distance),
            unit: s.unit,
        }));

    const [floorAreaSqm, floorAreaSqft] = extractSizings(data);

    return {
        id: data.id,
        url,
        price: priceAmount,
        currency: priceInfo.currencyCode ?? "GBP",
        bedrooms: safeInt(data.bedrooms),
        bathrooms: safeInt(data.bathrooms),
        address: displayAddress,
        postcode,
        description,
        propertyType: data.propertyType ?? data.propertySubType ?? null,
        propertySubType: data.propertySubType ?? null,
        agentName: customer.branchName ?? customer.companyName ?? null,
        agentBranch: customer.branchDisplayName ?? null,
        firstVisibleDate: data.firstVisibleDate ?? null,
        images: extractImages(data),
        floorplans: extractFloorplans(data),
        latitude: safeFloat(location.latitude),
        longitude: safeFloat(location.longitude),
        tenureType: tenure.tenureType ?? null,
        yearsRemainingOnLease: safeInt(tenure.yearsRemainingOnLease),
        annualServiceCharge: safeInt(livingCosts.annualServiceCharge),
        annualGroundRent: safeInt(livingCosts.annualGroundRent),
        groundRentReviewPeriodYears: safeInt(livingCosts.groundRentReviewPeriodInYears),
        groundRentPercentageIncrease: safeFloat(livingCosts.groundRentPercentageIncrease),
        councilTaxBand: livingCosts.councilTaxBand ?? null,
        displaySize: extractDisplaySize(data),
        pricePerSqft: priceInfo.pricePerSqFt ?? null,
        floorAreaSqm,
        floorAreaSqft,
        keyFeatures: extractKeyFeatures(data),
        listingUpdateReason: listingHistory.listingUpdateReason ?? null,
        listingStatus: tags.length ? tags[0] : null,
        tags,
        nearestStations,
        letAvailableDate: data.letAvailableDate ?? null,
        priceFrequency: priceInfo.frequency ?? null,
        transactionType,
        raw: data,
    };
}