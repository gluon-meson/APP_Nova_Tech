import { NextRequest, NextResponse } from 'next/server'

import { HTTP_METHOD } from '../../../../constants/http'

export async function POST(request: NextRequest) {
  const reqBody = await request.json()
  const res = await fetch(`${process.env.WEALTH_MANAGEMENT_CHAT_URL}`, {
    method: HTTP_METHOD.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
  let content = ''
  // @ts-ignore
  const reader = res.body.getReader()

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    const chunk = new TextDecoder('utf-8').decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data:')) {
        try {
          const data = JSON.parse(line.substring('data:'.length))
          const output = data.answer
          content += output
        } catch (error) {
          console.error('JSONDecodeError:', error)
        }
      }
    }
  }
  return NextResponse.json(
    { content: content ? content : 'Chat error, please try again later' },
    { status: 200 },
  )
}
