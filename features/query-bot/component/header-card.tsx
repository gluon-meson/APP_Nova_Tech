'use client'

import { ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
export const HeaderCard = () => {
  return (
    <Collapsible defaultOpen={true}>
      <div>
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
              The Wealth Management Assistant is a bank AI assistant. It
              primarily serves high-end private wealth managers the market.
            </p>
            <p className="mt-2 text-sm leading-normal text-muted-foreground">
              You can use this assistant to help you read research report.
            </p>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  )
}
