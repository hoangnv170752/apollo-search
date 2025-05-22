import { SearchForm } from "@/components/search-form"

export default function Search() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Search Papers</h1>
        <p className="text-muted-foreground mt-2">Find academic papers and research for your thesis</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <SearchForm />
      </div>
    </div>
  )
}
