import React from 'react'

import MarkdownRenderer from '@/components/markdown-renderer'

type Props = {
  className?: string
  content: string
  username?: string
}
export const UserMessage = ({ content, username }: Props) => {
  return (
    <div className="mb-3 rounded-lg bg-emerald-50 p-2 italic">
      <div className="mb-4">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <span>{username ? username : 'John'}'s question:</span>
      </div>
      <MarkdownRenderer markdown={content} />
    </div>
  )
}
