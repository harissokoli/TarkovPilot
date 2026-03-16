import sampleData from '../data/sampleMarkers.json';
import type { MarkerEntity } from '../types/models';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseMarker = (raw: unknown): MarkerEntity | null => {
  if (!isRecord(raw) || !isRecord(raw.geometry)) return null;
  const uid = typeof raw.uid === 'string' ? raw.uid : null;
  const map = typeof raw.map === 'string' ? raw.map : null;
  const name = typeof raw.name === 'string' ? raw.name : null;
  const category = typeof raw.category === 'string' ? raw.category : null;
  const updated = typeof raw.updated === 'string' ? raw.updated : new Date(0).toISOString();
  const x = typeof raw.geometry.x === 'number' ? raw.geometry.x : null;
  const y = typeof raw.geometry.y === 'number' ? raw.geometry.y : null;
  if (!uid || !map || !name || !category || x === null || y === null) return null;

  return {
    ...raw,
    uid,
    map,
    name,
    category,
    updated,
    geometry: { x, y },
    subCategory: typeof raw.subCategory === 'string' ? raw.subCategory : undefined,
    level: typeof raw.level === 'number' ? raw.level : 0,
    desc: typeof raw.desc === 'string' ? raw.desc : undefined,
    imgs: Array.isArray(raw.imgs)
      ? raw.imgs
          .filter(isRecord)
          .map((img) => ({ img: typeof img.img === 'string' ? img.img : '' }))
          .filter((img) => img.img.length > 0)
      : undefined,
    name_l10n: isRecord(raw.name_l10n)
      ? Object.fromEntries(Object.entries(raw.name_l10n).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
      : undefined,
    desc_l10n: isRecord(raw.desc_l10n)
      ? Object.fromEntries(Object.entries(raw.desc_l10n).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
      : undefined,
    itemsUid: Array.isArray(raw.itemsUid) ? raw.itemsUid.filter((v): v is string => typeof v === 'string') : undefined
  };
};

export const loadBundledMarkers = (): MarkerEntity[] =>
  sampleData.map(parseMarker).filter((marker): marker is MarkerEntity => marker !== null);

export const loadMarkersFromFile = async (file: File): Promise<MarkerEntity[]> => {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed)) return [];
  return parsed.map(parseMarker).filter((marker): marker is MarkerEntity => marker !== null);
};
