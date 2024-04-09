import React from 'react'

import MarkdownRenderer from '@/components/markdown-renderer'

type Props = {
  className?: string
  content: string
}
export const BotMessage = ({ content }: Props) => {
  return (
    <div className="mb-3 rounded-lg bg-gray-100 p-2">
      <div className="mb-4">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <span>GluonMeson's reply:</span>
      </div>
      <MarkdownRenderer markdown={content} />
    </div>
  )
}
