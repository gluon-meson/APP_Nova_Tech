import React from 'react'

import { IconUser } from '@/components/icons'
import MarkdownRenderer from '@/components/markdown-renderer'

type Props = {
  className?: string
  content: string
  username?: string
}
export const UserMessage = ({ content, username }: Props) => {
  return (
    <div className="mb-3 flex items-center rounded-lg p-2 text-xl font-bold">
      <div className="mr-6 flex size-[45px] items-center justify-center rounded-full border bg-white shadow-lg">
        <IconUser className="fill-violet-400" />
      </div>
      <div>
        <MarkdownRenderer markdown={content} />
      </div>
    </div>
  )
}
