import { PromptForm } from './prompt-form'

export const ChatPanel = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 flex w-full px-8">
      <div className="hidden w-72 opacity-0 md:block lg:w-80"></div>
      <div className="mx-auto max-w-4xl flex-1 md:pl-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm />
        </div>
      </div>
    </div>
  )
}
