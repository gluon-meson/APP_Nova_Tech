import { AI } from '@/features/chat-bot/action'
import { Chat } from '@/features/chat-bot/component/chat'
import { DataSourceCard } from '@/features/chat-bot/component/data-source-card'

export default function Page() {
  return (
    <main className="flex min-h-screen bg-muted/50 p-8">
      <DataSourceCard />
      <div className="hidden w-72 opacity-0 md:block lg:w-80"></div>
      <div className="flex-1">
        <AI>
          <Chat />
        </AI>
      </div>
    </main>
  )
}
