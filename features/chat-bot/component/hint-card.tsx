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
              Welcome to Wealth Management Assistant!
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
              The Assistant can help to analyze the stock and Index structured
              data that list on the left, provide insights into investment
              opportunities and economic indicators.
            </p>
            <p className="mt-2 text-sm leading-normal text-muted-foreground">
              Please feel free to ask, you can start from the below example
              queries!
            </p>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  )
}
