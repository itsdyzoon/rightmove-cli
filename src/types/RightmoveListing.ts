export type RightmoveListing = {
    id: any;
    url: string;
    price: number | null;
    currency: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    address: string | null;
    summary: string | null;
    propertyType: string | null;
    agentName: string | null;
    agentBranch: string | null;
    firstVisibleDate: string | null;
    images: string[];
    latitude: number | null;
    longitude: number | null;
    listingStatus: string | null;
    tags: string[];
    letAvailableDate: string | null;
    priceFrequency: string | null;
    students: boolean | null;
    transactionType: string | null;
    raw?: Record<string, any>;
}