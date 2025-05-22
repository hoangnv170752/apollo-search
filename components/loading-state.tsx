import { LoadingSpinner } from "@/components/loading-spinner"

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner className="h-8 w-8 text-primary mb-4" />
      <p className="text-foreground">Searching academic sources...</p>
      <p className="text-xs text-muted-foreground mt-2">
        This may take a moment as we search through academic databases
      </p>
    </div>
  )
}
