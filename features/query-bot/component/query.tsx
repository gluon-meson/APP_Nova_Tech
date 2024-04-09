'use client'

import { cloneDeep } from 'lodash'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import { IconFile, IconSend } from '@/components/icons'
import { BotMessage } from '@/features/query-bot/component/bot-message'
import { HeaderCard } from '@/features/query-bot/component/header-card'
import { UserMessage } from '@/features/query-bot/component/userMessage'
import { ChatType } from '@/features/query-bot/types'

import {
  getChatResponse,
  getUploadFiles,
} from '../../../app/api/query/getHomePage'
import { ChatInfo, type File, Message } from '../../../app/api/query/home'
import { ENTER_KEY } from '../../../constants/conmon'

export const Query = () => {
  const conversation = useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [uploadFiles, setUploadFiles] = useState([] as File[])
  const [messages, setMessages] = useState([] as Message[])
  const [answering, setAnswering] = useState(false)

  useEffect(() => {
    getUploadFiles().then((res) => {
      setUploadFiles(res)
    })
  }, [])

  const handleSendMessage = () => {
    const trimmedValue = inputValue.trim()
    if (inputValue && trimmedValue && !answering) {
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
  }

  const handleGetBotMessage = () => {
    setAnswering(true)
    setMessages((preMessages) => {
      return [
        ...preMessages,
        {
          id: Date.now().toString(),
          type: ChatType.AI,
          content: '',
        },
      ]
    })
    getChatResponse({
      question: inputValue,
      conversation_id: Date.now().toString(),
      user_id: 'John',
    } as ChatInfo)
      .then((res) => {
        setMessages((preMessages) => {
          const newMessages = cloneDeep(preMessages)
          newMessages[preMessages.length - 1].content = res.content
          return newMessages
        })
      })
      .catch(() => {
        setMessages((preMessages) => {
          const newMessages = cloneDeep(preMessages)
          newMessages[preMessages.length - 1].content =
            'Chat error, please try again later'
          return newMessages
        })
      })
      .finally(() => {
        setAnswering(false)
      })
  }
  const scrollToBottom = () => {
    if (conversation.current) {
      conversation.current.scrollTop = conversation.current.scrollHeight
    }
  }
  return (
    <main className="flex h-screen space-x-16 bg-gray-50 p-8">
      <div className="customBoxShadow flex w-80 flex-col rounded-lg px-8">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <h2 className="font-bold">Data Source</h2>
          <ul className="mt-8 flex-1 overflow-y-auto">
            {uploadFiles.map((item) => {
              return (
                <li
                  key={item.id}
                  className="mb-5 flex h-[42px] cursor-pointer items-center rounded-md px-2.5 odd:bg-gray-100"
                >
                  <IconFile className="mr-2.5" />
                  <span className="... truncate">{item.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="flex w-full flex-col overflow-x-hidden">
        <div
          className="mt-5 flex-1 overflow-y-scroll"
          ref={conversation}
        >
          {messages.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === ChatType.HUMAN ? (
                <UserMessage content={item.content} />
              ) : (
                <>
                  <div className="my-4 border-[0.5px]"></div>
                  <BotMessage
                    key={index}
                    content={item.content}
                    loading={answering}
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-white">
          <textarea
            value={inputValue}
            className="flex h-16 w-full resize-none bg-background px-3 py-[1.3rem] text-base placeholder:text-slate-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Ask GluonMeson ..."
            rows={1}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInputValue(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === ENTER_KEY && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <div className="mx-4">
            {answering ? (
              <IconSend className="fill-gray-400" />
            ) : (
              <IconSend
                className="fill-violet-400"
                onClick={handleSendMessage}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
