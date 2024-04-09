import React from 'react'

import { IconLogo } from '@/components/icons'
import MarkdownRenderer from '@/components/markdown-renderer'
import { Loading } from '@/components/ui/loading'

type Props = {
  content: string
  loading: boolean
}
export const BotMessage = ({ content, loading }: Props) => {
  return (
    <div className="mb-3 flex items-center rounded-lg p-2 text-xl">
      <div className="mr-6 flex size-[45px] items-center justify-center rounded-full border bg-violet-400 shadow-lg">
        <IconLogo className="fill-violet-400" />
      </div>
      <div>
        {loading && content.length === 0 ? (
          <Loading />
        ) : (
          <MarkdownRenderer markdown={content} />
        )}
      </div>
    </div>
  )
}
