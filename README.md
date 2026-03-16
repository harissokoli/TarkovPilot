# TarkovPilot Monorepo

This repository is now a monorepo with:

- `apps/backend/TarkovPilot`: existing C# backend preserved
- `apps/frontend`: new production-ready React + Vite + TypeScript interactive map client

## Frontend features

- Static image map renderer with smooth pan/zoom (`react-zoom-pan-pinch`)
- Typed marker model with defensive JSON parsing
- Map selection, floor/level switching, category filtering, text search
- Localization fallback (`requested lang -> en -> base field`)
- Marker details panel with image previews and metadata
- JSON upload support (local file)
- Error boundary and empty-safe UI behavior

## Quick start (frontend)

```bash
npm install
npm run dev
```

Then open the Vite URL shown in terminal.

### Other commands

```bash
npm run build
npm run typecheck
npm run preview
```

## Backend

Backend project remains in:

- `apps/backend/TarkovPilot/TarkovPilot.csproj`
- `TarkovPilot.sln` updated to point to the new path

## Data source

Use bundled sample markers in:

- `apps/frontend/src/features/maps/data/sampleMarkers.json`

Or upload your own decoded marker JSON file using the file picker in the app.
