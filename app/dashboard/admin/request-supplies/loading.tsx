import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-[250px]" />

        <div className="flex gap-2 mb-4">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>

        <div className="grid gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Skeleton className="h-6 w-[200px] mb-2" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-[100px] rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
