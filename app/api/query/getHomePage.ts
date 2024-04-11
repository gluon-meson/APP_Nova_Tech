import { HTTP_METHOD } from '../../../constants/http'
import { ChatInfo, type File } from './home'
import { type Reference } from './home'
import { uploadFiles } from './mockData'

export function getUploadFiles(): Promise<File[]> {
  return new Promise((resolve) => {
    resolve(uploadFiles)
  })
}

export async function getChatResponse(
  data: ChatInfo,
): Promise<{ content: string; references: Reference[] }> {
  const res = await fetch(`/api/query/chat`, {
    method: HTTP_METHOD.POST,
    body: JSON.stringify(data),
  })
  return await res.json()
}
