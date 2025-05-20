export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4"></div>
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-60 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-md p-3">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between mb-4">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
