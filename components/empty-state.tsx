import { FileSearch } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-primary/20 rounded-lg bg-accent/50">
      <div className="bg-primary/10 text-primary rounded-full p-3 mb-4">
        <FileSearch className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium mb-2">Start Your Research</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        Use the search form above to find academic papers and research related to your thesis topic.
      </p>
      <div className="text-sm text-muted-foreground max-w-md">
        <p className="mb-2">Try searching for:</p>
        <ul className="list-disc list-inside text-left space-y-1">
          <li>"Recent advances in machine learning for natural language processing"</li>
          <li>"Climate change impact on coastal ecosystems"</li>
          <li>"Blockchain applications in supply chain management"</li>
        </ul>
      </div>
      <div className="mt-4">
        <Link href="/advanced" className="text-primary hover:underline">
          Try Advanced Search
        </Link>
      </div>
    </div>
  )
}
