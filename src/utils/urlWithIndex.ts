export const urlWithIndex = (url: string, index: string | number): string => {
    const u = new URL(url);
    u.searchParams.set("index", String(index));
    return u.toString();
}