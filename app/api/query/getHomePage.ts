import { HTTP_METHOD } from '../../../constants/http'
import { ChatInfo, type File } from './home'
import { uploadFiles } from './mockData'

export function getUploadFiles(): Promise<File[]> {
  return new Promise((resolve) => {
    resolve(uploadFiles)
  })
}

export async function getChatResponse(
  data: ChatInfo,
): Promise<{ content: string }> {
  const res = await fetch(`/api/query/chat`, {
    method: HTTP_METHOD.POST,
    body: JSON.stringify(data),
  })
  return await res.json()
}
