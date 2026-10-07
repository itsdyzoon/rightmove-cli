export const extractImages = (data: Record<string, any>): string[] => {
    const images: string[] = [];
    let sources: any = data.propertyImages ?? data.images ?? [];
    if (sources && !Array.isArray(sources) && typeof sources === "object") {
        sources = sources.images ?? [];
    }
    for (const img of sources ?? []) {
        if (img && typeof img === "object") {
            const url = img.srcUrl ?? img.url;
            if (url) images.push(url);
        }
    }
    if (images.length === 0) {
        const primary = data.displayImageUrl ?? data.displayImage;
        if (primary) images.push(primary);
    }
    return images;
}