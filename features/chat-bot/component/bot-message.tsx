'use client'
import './github-markdown-light.css'

import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import remarkGfm from 'remark-gfm'

import { IconAI } from '@/components/icons'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { cn } from '@/lib/utils'

function BotMessageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('group flex items-start', className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconAI />
      </div>
      <div className="ml-4 flex-1 overflow-hidden px-1">{children}</div>
    </div>
  )
}

type Props = {
  className?: string
  content: React.ReactNode
  toolContent?: React.ReactNode
}

export function BotMessage({ content, className, toolContent }: Props) {
  return (
    <BotMessageContainer className={className}>
      <ErrorBoundary
        fallback={
          <div>
            {content && typeof content === 'string'
              ? content
              : 'Rendering error when show bot message'}
          </div>
        }
      >
        {toolContent && <div>{toolContent}</div>}
        {content}
      </ErrorBoundary>
    </BotMessageContainer>
  )
}

export const TextMessage = ({ text }: { text: string }) => {
  return (
    <ErrorBoundary fallback={<div>{text}</div>}>
      <MemoizedReactMarkdown
        className="markdown-body"
        remarkPlugins={[remarkGfm /* additional plugins */]}
      >
        {text}
      </MemoizedReactMarkdown>
    </ErrorBoundary>
  )
}
