import { AreaChartIcon, BookOpenIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="p-8">
      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        Wealth Management Assistants
      </h2>
      <div className="mt-8 flex space-x-6">
        <Link
          href="/query-bot"
          className="h-32 w-64 rounded-lg bg-gray-50 p-4 shadow transition hover:bg-gray-100 hover:shadow-xl"
        >
          <h3 className="flex items-center text-xl">
            <BookOpenIcon className="mr-2" /> Query Assistant
          </h3>
          <p className="mt-6 text-sm text-gray-700">
            Query research reports with conversational AI
          </p>
        </Link>
        <Link
          href="/chart-bot"
          className="h-32 w-64 rounded-lg bg-gray-50 p-4 shadow transition hover:bg-gray-100 hover:shadow-xl"
        >
          <h3 className="flex items-center text-xl">
            <AreaChartIcon className="mr-2" />
            Chart Assistant
          </h3>
          <p className="mt-6 text-sm text-gray-700">
            Analyze structure market data and present multiple chart
          </p>
        </Link>
      </div>
    </div>
  )
}
