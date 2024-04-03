import { useActions } from 'ai/rsc'

import { exampleMessages } from '../constants'
import { UIState, UIStateType } from '../types'

export const ExampleMessages = ({
  setMessages,
}: {
  setMessages: React.Dispatch<React.SetStateAction<UIState>>
}) => {
  const { submitUserMessage } = useActions()
  return (
    <div className="mb-4 grid grid-cols-1 gap-2 px-4 sm:grid-cols-2 sm:px-0">
      {exampleMessages.map((example, index) => (
        <div
          key={example.heading}
          className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900`}
          onClick={async () => {
            setMessages((currentMessages) => [
              ...currentMessages,
              {
                id: Date.now().toString(),
                type: UIStateType.USER,
                display: { content: example.message },
              },
            ])

            const responseMessage = await submitUserMessage(example.message)

            setMessages((currentMessages) => [
              ...currentMessages,
              responseMessage,
            ])
          }}
        >
          <div className="text-sm font-semibold">{example.heading}</div>
          <div className="text-sm text-zinc-600">{example.message}</div>
        </div>
      ))}
    </div>
  )
}
