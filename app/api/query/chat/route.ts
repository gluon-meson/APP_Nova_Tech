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
  const references = []
  const response = await res.text()
  const data = response.substring(6)
  const parse = JSON.parse(data)
  const content = parse['answer']
  for (const reference of JSON.parse(parse['references'])) {
    references.push(reference)
  }

  return NextResponse.json(
    {
      content: content ? content : 'Chat error, please try again later',
      references: references,
    },
    { status: 200 },
  )
}
