export type SearchFilters = {
    propertyType?: string;
    buildingType?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    minBedrooms?: number | null;
    maxBedrooms?: number | null;
    radius?: number | null;
    sortBy?: string | null;
}