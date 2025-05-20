export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-2"></div>
        <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-900 border rounded-lg p-6 animate-pulse">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-md mb-4"></div>
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded-md mb-2"></div>
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
              <div className="p-6 border-b">
                <div className="flex justify-between">
                  <div>
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-md mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex gap-2">
                      <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded-full mt-1"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-4">
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
