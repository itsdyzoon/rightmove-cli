import {RM_BASE} from "../constants/constants.js";

export const fullRmUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    return path.startsWith("/") ? `${RM_BASE}${path}` : path;
}