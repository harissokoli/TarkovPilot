import type { MapMetadata } from '../types/models';

export const mapConfig: Record<string, MapMetadata> = {
  woods: {
    id: 'woods',
    displayName: 'Woods',
    width: 2048,
    height: 2048,
    defaultZoom: 1,
    defaultCenter: { x: 1024, y: 1024 },
    levels: [
      { id: 0, name: 'Surface', imagePath: '/maps/woods-level-0.svg' }
    ],
    themeColor: '#22c55e'
  },
  labs: {
    id: 'labs',
    displayName: 'Labs',
    width: 2048,
    height: 2048,
    defaultZoom: 1,
    defaultCenter: { x: 1024, y: 1024 },
    levels: [
      { id: 0, name: 'B1', imagePath: '/maps/labs-level-0.svg' },
      { id: 1, name: 'B2', imagePath: '/maps/labs-level-1.svg' }
    ],
    themeColor: '#38bdf8'
  }
};

export const supportedMaps = Object.values(mapConfig);
