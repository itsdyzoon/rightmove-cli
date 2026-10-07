import {SearchFilters} from "../../types/SearchFilters.js";
import {BUILDING_TYPES, PROPERTY_TYPES, RM_BASE, SORT_TYPES} from "../../constants/constants.js";
import {lookupPostcode} from "./parts/lookupPostcode.js";

export const buildSearchUrl =  async (postcode: string, filters: SearchFilters = {}): Promise<string> => {
    const identifier = await lookupPostcode(postcode);
    if (!identifier) throw new Error(`No Rightmove location found for '${postcode}'`);

    // Full postcodes are tight searches; default to a small radius so the first
    // request is more likely to return results.
    let radius = filters.radius ?? null;
    if (radius === null && identifier.startsWith("POSTCODE^")) radius = 0.25;

    const path = PROPERTY_TYPES[filters.propertyType ?? "sale"] ?? "property-for-sale";
    const params = new URLSearchParams({ locationIdentifier: identifier });

    if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
    if (filters.minBedrooms != null) params.set("minBedrooms", String(filters.minBedrooms));
    if (filters.maxBedrooms != null) params.set("maxBedrooms", String(filters.maxBedrooms));
    if (radius != null) params.set("radius", String(radius));
    if (filters.sortBy) {
        const code = SORT_TYPES[filters.sortBy];
        if (code != null) params.set("sortType", String(code));
    }
    if (filters.buildingType) {
        const rmType = BUILDING_TYPES[filters.buildingType.toUpperCase()];
        if (rmType) params.set("propertyTypes", rmType);
    }

    return `${RM_BASE}/${path}/find.html?${params.toString()}`;
}
