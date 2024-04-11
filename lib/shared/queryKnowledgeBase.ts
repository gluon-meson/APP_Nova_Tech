import { logger } from '@/lib/shared/index'

enum SearchSortType {
  Desc = 'desc',
  Asc = 'asc',
}
type SearchFilters = {
  field: string
  op: string
  value: string
  join_op?: string
}

interface SearchSort {
  field: string
  order: SearchSortType
}

export type KB_QUERY_PARAM = {
  data_set_id: number
  size?: number
  page?: number
  query: string
  // embedding_type?: string
  filters?: SearchFilters[]
  sort?: SearchSort[]
}

export type KB_QUERY_RESP<T = Record<string, any>> = {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export const queryKnowledgeBase = async <T = Record<string, any>>(
  params: KB_QUERY_PARAM,
): Promise<KB_QUERY_RESP<T>> => {
  const { page = 1, data_set_id, query = '' } = params
  const size = 100 // todo update this after api fixed
  const res = await fetch(
    `${process.env.KNOWLEDGE_BASE_URL}/data-sets/${data_set_id}/search?${new URLSearchParams({ size: size.toString(), page: page.toString() })}`,
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${process.env.OFFLINE_TOKEN}`,
      },
      body: JSON.stringify({
        query: query,
      }),
      method: 'POST',
    },
  )

  if (!res.ok) {
    const error = new Error(
      `queryKnowledgeBase error! status: ${res.status}, message: ${res.statusText}`,
    )
    error.cause = res
    throw error
  }
  const data = await res.json()

  logger.info(
    {
      params,
      data,
    },
    'queryKnowledgeBase done with:',
  )
  return data
}
