'use client'
import { AreaChartIcon, BookOpenIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const SwitchBotNav = () => {
  const pathname = usePathname()
  if (pathname.startsWith('/chart-bot')) {
    return (
      <div className="fixed right-4 top-4">
        <Link href="/query-bot">
          <BookOpenIcon />
        </Link>
      </div>
    )
  }
  if (pathname.startsWith('/query-bot')) {
    return (
      <div className="fixed right-4 top-4">
        <Link href="/chart-bot">
          <AreaChartIcon />
        </Link>
      </div>
    )
  }
  return null
}
