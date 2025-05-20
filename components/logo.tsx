import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  linkWrapper?: boolean
}

export function Logo({ className, linkWrapper = true }: LogoProps) {
  const logoContent = (
    <>
      <div className="relative h-8 w-8 overflow-hidden">
        <Image src="/logo.svg" alt="Hayoma Dairy Logo" width={32} height={32} priority />
      </div>
      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Hayoma Dairy</span>
    </>
  )

  if (linkWrapper) {
    return (
      <Link href="/" className="flex items-center gap-2">
        {logoContent}
      </Link>
    )
  }

  return <div className="flex items-center gap-2">{logoContent}</div>
}
