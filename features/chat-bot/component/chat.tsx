'use client'

import { ChatList } from './chat-list'
import { ChatPanel } from './chat-panel'
import { HintCard } from './hint-card'

export const Chat = () => {
  return (
    <main className="min-h-screen bg-muted/50 pb-[200px] pt-4 md:pt-10">
      <HintCard />
      <ChatList />
      <ChatPanel />
    </main>
  )
}
