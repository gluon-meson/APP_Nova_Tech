'use client'

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { ExampleMessages } from '@/features/chat-bot/component/example-messages'
import { useUIState } from 'ai/rsc'
import type { AI } from '@/features/chat-bot/action'

export const HintCard = () => {
  const [messages, setMessages] = useUIState<typeof AI>()

  return (
    <Collapsible defaultOpen={true}>
      <div className="mx-auto max-w-4xl md:pl-4">
        <div className="flex flex-col gap-2 rounded-lg border bg-background p-4">
          <CollapsibleContent>
            {messages.length != -1 && (
              <ExampleMessages setMessages={setMessages} />
            )}
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  )
}
