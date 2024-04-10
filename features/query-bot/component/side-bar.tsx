'use client'
import { useEffect, useState } from 'react'

import { IconFile } from '@/components/icons'

import { getUploadFiles } from '../../../app/api/query/getHomePage'
import { File } from '../../../app/api/query/home'

export default function SideBar() {
  const [uploadFiles, setUploadFiles] = useState([] as File[])

  useEffect(() => {
    getUploadFiles().then((res) => {
      setUploadFiles(res)
    })
  }, [])

  return (
    <div className="customBoxShadow flex w-80 flex-col rounded-lg p-8">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <h2 className="font-bold">Data Source</h2>
        <ul className="mt-8 flex-1 overflow-y-auto">
          {uploadFiles.map((item) => {
            return (
              <li
                key={item.id}
                className="mb-5 flex h-[42px] cursor-pointer items-center rounded-md px-2.5 odd:bg-gray-100"
              >
                <IconFile className="mr-2.5" />
                <span className="... truncate">{item.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
