import type { Marker, MediaItem, Sequence, TimelineClip, Track } from "./types";
import { createId } from "./utils";

const DB_NAME = "nle-editor";
const DB_VERSION = 1;
const MEDIA_STORE = "media";
const PROJECT_STORE = "project";

type StoredMediaItem = Omit<MediaItem, "src" | "file"> & {
  file?: Blob | null;
  fileType?: string;
  src?: string;
};

type StoredProject = {
  id: string;
  sequence: Sequence;
  tracks: Track[];
  clips: TimelineClip[];
  markers?: Marker[];
  sequenceId?: string;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(PROJECT_STORE)) {
        db.createObjectStore(PROJECT_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaItems(items: MediaItem[]) {
  const db = await openDatabase();
  const transaction = db.transaction(MEDIA_STORE, "readwrite");
  const store = transaction.objectStore(MEDIA_STORE);

  await Promise.all(
    items.map((item) => {
      const record: StoredMediaItem = {
        ...item,
        src: item.src,
        file: item.file ?? null,
        fileType: item.file?.type
      } as StoredMediaItem;
      return new Promise((resolve, reject) => {
        const request = store.put(record);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    })
  );

  await new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function loadMediaItems(): Promise<MediaItem[]> {
  const db = await openDatabase();
  const transaction = db.transaction(MEDIA_STORE, "readonly");
  const store = transaction.objectStore(MEDIA_STORE);
  const request = store.getAll();

  const records = await new Promise<StoredMediaItem[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as StoredMediaItem[]);
    request.onerror = () => reject(request.error);
  });

  return records.map((item) => {
    if (item.file) {
      const file = new File([item.file], item.name, { type: item.fileType });
      const src = URL.createObjectURL(file);

      return {
        ...item,
        id: item.id ?? createId("media"),
        file,
        src,
        thumbnail: item.thumbnail ?? src
      };
    }

    return {
      ...item,
      id: item.id ?? createId("media"),
      file: undefined,
      src: item.src,
      thumbnail: item.thumbnail ?? item.src
    };
  });
}

export async function saveProjectState(payload: {
  sequence: Sequence;
  tracks: Track[];
  clips: TimelineClip[];
  markers: Marker[];
  sequenceId?: string;
}) {
  const db = await openDatabase();
  const transaction = db.transaction(PROJECT_STORE, "readwrite");
  const store = transaction.objectStore(PROJECT_STORE);
  const record: StoredProject = {
    id: "active-project",
    sequence: payload.sequence,
    tracks: payload.tracks,
    clips: payload.clips,
    markers: payload.markers,
    sequenceId: payload.sequenceId
  };

  await new Promise((resolve, reject) => {
    const request = store.put(record);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });

  await new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function loadProjectState(): Promise<StoredProject | null> {
  const db = await openDatabase();
  const transaction = db.transaction(PROJECT_STORE, "readonly");
  const store = transaction.objectStore(PROJECT_STORE);
  const request = store.get("active-project");

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}
