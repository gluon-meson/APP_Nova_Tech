'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import { IconSend } from '@/components/icons'
import { BotMessage } from '@/features/query-bot/component/botMessage'
import { UserMessage } from '@/features/query-bot/component/userMessage'
import { ChatType } from '@/features/query-bot/types'

import {
  getChatResponse,
  getUploadFiles,
} from '../../../app/api/query/getHomePage'
import { type File, Message } from '../../../app/api/query/home'

export const Query = () => {
  const conversation = useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [uploadFiles, setUploadFiles] = useState([] as File[])
  const [messages, setMessages] = useState([] as Message[])

  useEffect(() => {
    getUploadFiles().then((res) => {
      setUploadFiles(res)
    })
  }, [])

  const handleSendMessage = () => {
    scrollToBottom()
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now().toString(),
        type: ChatType.HUMAN,
        content: inputValue,
      },
    ])
    setInputValue('')
    handleGetBotMessage()
  }

  const handleGetBotMessage = () => {
    getChatResponse().then((res) => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now().toString(),
          type: ChatType.AI,
          content: res,
        },
      ])
    })
  }
  const scrollToBottom = () => {
    if (conversation.current) {
      conversation.current.scrollTop = conversation.current.scrollHeight
    }
  }
  return (
    <main className="flex h-screen space-x-16 p-8">
      <div className="w-80">
        <h1 className="font-bold">News navigator</h1>
        <div className="mt-16">
          <h2 className="font-bold">Upload Files</h2>
          <ul className="mt-8">
            {uploadFiles.map((item) => {
              return (
                <li
                  key={item.id}
                  className="mb-5 flex h-16 items-center bg-violet-400 text-white"
                >
                  <span className="... truncate">{item.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="flex w-full flex-col overflow-x-hidden">
        <div
          className="flex-1 overflow-y-scroll"
          ref={conversation}
        >
          {messages.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === ChatType.HUMAN ? (
                <UserMessage content={item.content} />
              ) : (
                <BotMessage content={item.content} />
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between bg-emerald-50">
          <input
            type="text"
            value={inputValue}
            className="flex h-16 w-full bg-background bg-emerald-50 px-3 py-2 text-base placeholder:text-slate-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Ask GluonMeson ..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInputValue(e.target.value)
            }
          />
          <div className="mx-4">
            <IconSend onClick={handleSendMessage} />
          </div>
        </div>
      </div>
    </main>
  )
}
