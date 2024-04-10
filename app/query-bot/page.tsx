import * as React from 'react'

import { Query } from '@/features/query-bot/component/query'
import SideBar from '@/features/query-bot/component/side-bar'

export default function QueryBot() {
  return (
    <main className="flex h-screen bg-gray-50 p-8">
      <SideBar />
      <Query />
    </main>
  )
}
