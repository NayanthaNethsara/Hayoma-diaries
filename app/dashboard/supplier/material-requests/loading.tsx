import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px] mt-2" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[120px]" />
          <Skeleton className="h-4 w-[180px] mt-1" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <Skeleton className="h-4 w-[60px] mb-2" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[60px] mb-2" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-4 w-[100px] mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-full" />
            </div>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-[200px]" />
        </CardFooter>
      </Card>
    </div>
  )
}
