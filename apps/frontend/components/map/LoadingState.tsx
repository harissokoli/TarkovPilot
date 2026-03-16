export function LoadingState() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading map data...</p>
      </div>
    </div>
  )
}

export function MapImageSkeleton() {
  return (
    <div className="w-full h-full bg-card animate-pulse flex items-center justify-center">
      <p className="text-xs text-muted-foreground">Loading map...</p>
    </div>
  )
}
