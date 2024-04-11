import React from 'react'

import { IconLogo } from '@/components/icons'
import MarkdownRenderer from '@/components/markdown-renderer'
import { Loading } from '@/components/ui/loading'
import References from '@/features/query-bot/component/references'

import { Reference } from '../../../app/api/query/home'

type Props = {
  content: string
  loading: boolean
  references?: Reference[]
}
export const BotMessage = ({ content, loading, references }: Props) => {
  return (
    <div className="mb-3 flex items-start rounded-lg p-2 text-xl">
      <div className="mr-6 flex size-[45px] items-center justify-center self-start rounded-full border bg-violet-400 shadow-lg">
        <IconLogo className="fill-violet-400" />
      </div>
      <div className="mr-[40px] flex-1 self-center overflow-hidden">
        {loading && content.length === 0 ? (
          <Loading />
        ) : (
          <>
            <MarkdownRenderer markdown={content} />
            {references && references.length > 0 && (
              <References references={references} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
