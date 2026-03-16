import useSWR from "swr"
import type { Marker } from "@/types/marker"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export interface UseMarkersResult {
  markers: Marker[]
  isLoading: boolean
  error: Error | undefined
}

/**
 * Fetches all markers for a given mapId from the API route.
 * Returns an empty array while loading or on error so callers don't need
 * to guard against undefined.
 */
export function useMarkers(mapId: string): UseMarkersResult {
  const { data, error, isLoading } = useSWR<Marker[]>(
    mapId ? `/api/markers?map=${mapId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  )

  return {
    markers: Array.isArray(data) ? data : [],
    isLoading,
    error,
  }
}
