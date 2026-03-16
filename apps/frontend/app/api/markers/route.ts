import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"
import type { Marker } from "@/types/marker"

let cachedMarkers: Marker[] | null = null

function loadMarkers(): Marker[] {
  if (cachedMarkers) return cachedMarkers

  const filePath = join(process.cwd(), "data", "markers.json")
  const raw = readFileSync(filePath, "utf-8")
  const parsed = JSON.parse(raw)

  // Validate it's an array; filter out malformed entries defensively
  if (!Array.isArray(parsed)) return []

  cachedMarkers = parsed.filter(
    (m): m is Marker =>
      typeof m === "object" &&
      m !== null &&
      typeof m.uid === "string" &&
      typeof m.map === "string" &&
      typeof m.name === "string" &&
      typeof m.category === "string" &&
      typeof m.geometry?.x === "number" &&
      typeof m.geometry?.y === "number"
  )

  return cachedMarkers
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mapId = searchParams.get("map")

  const markers = loadMarkers()
  const filtered = mapId ? markers.filter((m) => m.map === mapId) : markers

  return NextResponse.json(filtered, {
    headers: {
      // Cache for 1 hour — data rarely changes
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
