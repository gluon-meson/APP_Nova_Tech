import { LoaderIcon, UserRoundIcon } from 'lucide-react'

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group flex items-start">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <UserRoundIcon size={16} />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {children}
      </div>
    </div>
  )
}

export function SpinnerWithText({ text }: { text?: React.ReactNode }) {
  return (
    <div className="mt-1 flex items-center">
      <LoaderIcon
        className="mr-2 animate-spin"
        size={20}
      />
      <span className="ml-1.5 text-sm text-gray-700">{text}</span>
    </div>
  )
}
