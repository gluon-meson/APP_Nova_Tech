'use client'

import { groupBy } from 'lodash'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { type Reference } from '../../../app/api/query/home'

type Props = {
  references: Reference[]
}
interface IGroupReferences {
  [key: string]: Reference[]
}
export default function References({ references }: Props) {
  const [groupReferences, setGroupReferences] = useState<IGroupReferences>(
    {} as IGroupReferences,
  )
  useEffect(() => {
    setGroupReferences(groupBy(references, 'data_set_id') as IGroupReferences)
  }, [references])
  return (
    <div className="mt-4">
      <details>
        <summary className="cursor-pointer text-base">
          References Detail
        </summary>
        {Object.keys(groupReferences).map((id) => {
          return (
            <div key={id}>
              <details>
                <summary className="cursor-pointer text-sm">
                  {groupReferences[id][0].meta__source_name}
                </summary>
                {groupReferences[id].map((item: Reference, index: number) => {
                  return (
                    <Card
                      key={index}
                      className="mb-[20px] max-h-[300px] overflow-hidden text-xs odd:bg-slate-50"
                    >
                      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                        <span className="w-max rounded-lg border p-2">
                          # references__{[index + 1]}
                        </span>
                        <span className="!mt-0 w-max rounded-lg border p-2">
                          {item.meta__source_score.toFixed(4)}
                        </span>
                      </CardHeader>
                      <CardContent className="max-h-[240px] overflow-auto">
                        {item.meta__source_text}
                      </CardContent>
                    </Card>
                  )
                })}
              </details>
            </div>
          )
        })}
      </details>
    </div>
  )
}
