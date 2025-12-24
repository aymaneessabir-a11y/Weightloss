import { set, get, del, keys } from 'idb-keyval';

export interface ProgressPhoto {
    date: string; // ISO Date String (YYYY-MM-DD)
    blob: Blob;
    type: string; // image/jpeg, image/png
}

const PHOTO_STORE_PREFIX = 'progress_photo_';

// Save a photo for a specific date
export async function savePhoto(date: string, file: File): Promise<void> {
    const key = `${PHOTO_STORE_PREFIX}${date}`;
    // Resize logic could go here, but storing raw File/Blob is okay for MVP if small enough
    await set(key, file);
}

// Get photo for a specific date
export async function getPhoto(date: string): Promise<File | undefined> {
    const key = `${PHOTO_STORE_PREFIX}${date}`;
    return await get<File>(key);
}

// Get all dates that have photos
export async function getSubscribedPhotoDates(): Promise<string[]> {
    const allKeys = await keys();
    return allKeys
        .filter(k => typeof k === 'string' && k.startsWith(PHOTO_STORE_PREFIX))
        .map(k => (k as string).replace(PHOTO_STORE_PREFIX, ''))
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Newest first
}

export async function deletePhoto(date: string): Promise<void> {
    const key = `${PHOTO_STORE_PREFIX}${date}`;
    await del(key);
}
