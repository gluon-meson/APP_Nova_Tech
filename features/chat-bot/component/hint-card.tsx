'use client'

import { ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
export const HintCard = () => {
  return (
    <Collapsible defaultOpen={true}>
      <div className="mx-auto max-w-4xl md:pl-4">
        <div className="flex flex-col gap-2 rounded-lg border bg-background p-4">
          <div className="flex justify-between">
            <h1 className="text-lg font-semibold">
              欢迎来到诺瓦科技管理助手!
            </h1>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-9 p-0"
              >
                <ChevronsUpDown className="size-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <p className="text-sm leading-normal text-muted-foreground">
              您好，我可以协助您管理经营层面的事务并查询相关数据。有任何需要帮助的地方，请随时提问。
            </p>
            <p className="mt-2 text-sm leading-normal text-muted-foreground">
              你可以从下面的示例开始：
            </p>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  )
}
