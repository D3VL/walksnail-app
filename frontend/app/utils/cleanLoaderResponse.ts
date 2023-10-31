const CMS_URL = 'cms.walksnail.app/assets';
const IMAGES_CDN = 'files.walksnail.app';

export default function cleanLoaderResponse(obj: any): any {
    if (typeof obj === 'string') {
        return obj.replace(CMS_URL, IMAGES_CDN);
    }

    if (Array.isArray(obj)) {
        return obj.map(cleanLoaderResponse);
    }

    if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, cleanLoaderResponse(value)]));
    }

    return obj;
}