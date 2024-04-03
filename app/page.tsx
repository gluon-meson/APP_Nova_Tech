import Link from 'next/link'

export default function Home() {
  return (
    <div className="p-8">
      <h1>home</h1>
      <div className="mt-4 grid grid-cols-1 gap-2">
        <Link
          href="/query-bot"
          className="underline"
        >
          Query bot
        </Link>
        <Link
          href="/chart-bot"
          className="underline"
        >
          Chart bot
        </Link>
      </div>
    </div>
  )
}
