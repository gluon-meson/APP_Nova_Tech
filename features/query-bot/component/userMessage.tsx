import React from 'react'

type Props = {
  className?: string
  content: React.ReactNode
  username?: string
}
export const UserMessage = ({ content, username }: Props) => {
  return (
    <div className="mb-3 rounded-lg bg-emerald-50 p-2 italic">
      <div className="mb-4">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <span>{username ? username : 'John'}'s question:</span>
      </div>
      <div className="break-words">{content}</div>
    </div>
  )
}
