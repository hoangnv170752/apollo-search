import { Star } from "lucide-react"

interface ApoloLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function ApoloLogo({ size = "md", showText = true }: ApoloLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="absolute -top-1 -right-1">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
        </div>
        <div className="rounded-full bg-black p-1 dark:bg-gray-800">
          <Star className={`${sizeClasses[size]} fill-amber-500 text-amber-500`} />
        </div>
      </div>
      {showText && (
        <span className={`font-serif font-bold ${textClasses[size]}`}>
          <span className="text-primary">apollo</span>
          <span className="text-foreground">search</span>
        </span>
      )}
    </div>
  )
}
