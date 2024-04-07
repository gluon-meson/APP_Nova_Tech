import { type File } from './home'
import { uploadFiles } from './mockData'
export function getUploadFiles(): Promise<File[]> {
  return new Promise((resolve) => {
    resolve(uploadFiles)
  })
}

export function getChatResponse(): Promise<string> {
  return new Promise((resolve) => {
    resolve('You are right!')
  })
}
