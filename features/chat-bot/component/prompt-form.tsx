'use client'

import { useActions, useUIState } from 'ai/rsc'
import { SendHorizonal } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/hooks/client'

import type { AI } from '../action'
import { UIStateType } from '../types'

export const PromptForm = () => {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const [inputValue, setInputValue] = React.useState('')
  const [_, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()
        // Add user message to UI state
        const value = inputValue.trim()
        setInputValue('')
        if (!value) return

        // Optimistically add user message UI
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: Date.now().toString(),
            type: UIStateType.USER,
            display: {
              content: value,
            },
          },
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages((currentMessages) => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12 sm:pl-4">
        <Textarea
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none border-0 bg-transparent px-4 py-[1.3rem] focus-within:outline-none focus:ring-0 sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInputValue(e.target.value)
          }
        />
        <div className="absolute right-0 top-4 sm:right-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={inputValue === ''}
              >
                <SendHorizonal size={16} />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
