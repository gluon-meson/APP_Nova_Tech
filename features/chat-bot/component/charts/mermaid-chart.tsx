'use client'

import mermaid from 'mermaid'
import { useEffect } from 'react'

mermaid.initialize({})

export const Mermaid = ({
  chartCode,
  id,
}: {
  chartCode: string
  id: string
}) => {
  useEffect(() => {
    document.getElementById(id)?.removeAttribute('data-processed')
    mermaid.contentLoaded()
  }, [chartCode, id])

  return (
    <div
      className="mermaid"
      id={id}
    >
      {chartCode}
    </div>
  )
}
