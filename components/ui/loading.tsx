import {IconLoading} from "@/components/icons";

export const Loading = () => {
  return (
    <div className="flex items-center">
      <IconLoading className="animate-spin fill-slate-500"/>
      <span className="ml-2 text-sm text-slate-500">Answering...</span>
    </div>
  )
}
