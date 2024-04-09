import React from 'react'

import MarkdownRenderer from '@/components/markdown-renderer'
import { Loading } from '@/components/ui/loading'

type Props = {
  content: string
  loading: boolean
}
export const BotMessage = ({ content, loading }: Props) => {
  return (
    <div className="mb-3 rounded-lg bg-gray-100 p-2">
      <div className="mb-4">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <span>GluonMeson's reply:</span>
      </div>
      {loading && content.length === 0 ? (
        <Loading />
      ) : (
        <MarkdownRenderer markdown={content} />
      )}
    </div>
  )
}
