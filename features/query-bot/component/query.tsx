'use client'

import TextArea from 'antd/lib/input/TextArea'
import { cloneDeep } from 'lodash'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import { IconSend } from '@/components/icons'
import { BotMessage } from '@/features/query-bot/component/bot-message'
import { UserMessage } from '@/features/query-bot/component/userMessage'
import { ChatType } from '@/features/query-bot/types'

import { getChatResponse } from '../../../app/api/query/getHomePage'
import { ChatInfo, Message } from '../../../app/api/query/home'
import { ENTER_KEY } from '../../../constants/conmon'

export const Query = () => {
  const conversation = useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = useState('')

  const [messages, setMessages] = useState([] as Message[])
  const [answering, setAnswering] = useState(false)

  const handleSendMessage = () => {
    const trimmedValue = inputValue.trim()
    if (inputValue && trimmedValue && !answering) {
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
          newMessages[preMessages.length - 1].references = res.references
          return newMessages
        })
      })
      .catch((error) => {
        console.log('get chat response error', error)
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

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      if (conversation.current) {
        conversation.current.scrollTop = conversation.current.scrollHeight
      }
    }, 100)
  }
  return (
    <div className="ml-16 mr-8 flex w-full flex-col">
      <div className="w-full flex-1 overflow-auto">
        <div
          className="mt-5 flex-1 overflow-y-scroll"
          ref={conversation}
        >
          {messages.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === ChatType.HUMAN ? (
                <>
                  <UserMessage content={item.content} />
                  {index !== messages.length && (
                    <div className="my-4 border-[0.5px]"></div>
                  )}
                </>
              ) : (
                <BotMessage
                  key={index}
                  content={item.content}
                  references={item.references}
                  loading={answering}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="customBoxShadow flex items-center justify-between rounded-lg bg-white">
        <TextArea
          className="flex h-16 w-full resize-none rounded-lg border-0 bg-background px-3 py-[1.3rem] text-base placeholder:text-slate-700 focus:ring-transparent disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="send your message ..."
          autoSize={{ minRows: 1, maxRows: 5.5 }}
          value={inputValue}
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
  )
}
