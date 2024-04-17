import { ClockIcon, PlusCircleIcon } from 'lucide-react'

export const DataSourceCard = () => {
  return (
    <div className="fixed top-8 z-10 mb-4 hidden min-h-screen w-72 overflow-auto rounded-lg bg-muted/50 p-2 shadow md:block lg:w-72 lg:p-5">
      <h4 className="text-1xl flex scroll-m-20 items-center font-semibold tracking-tight">
        <ClockIcon
          className="mr-2"
          size={32}
        />{' '}
        历史会话｜
        <PlusCircleIcon
          className="mr-2"
          size={32}
        />{' '}
        新会话
      </h4>
    </div>
  )
}
