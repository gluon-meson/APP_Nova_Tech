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

export type KB_QUERY_RESP = {
  items: Record<string, any>[]
  total: number
  page: number
  size: number
  pages: number
}
export const queryKnowledgeBase = async (
  params: KB_QUERY_PARAM,
): Promise<KB_QUERY_RESP | undefined> => {
  const { page = 1, size = 100, data_set_id, query = '' } = params
  try {
    const res = await fetch(
      `${process.env.KNOWLEDGE_BASE_URL}/data-sets/${data_set_id}/search`,
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
    ).then((res) => {
      if (!res.ok) {
        throw new Error(`queryKnowledgeBase error! status: ${res.status}`)
      }
      return res.json()
    })

    logger.info(
      {
        params,
        res,
      },
      'queryKnowledgeBase done with:',
    )
    return res
  } catch (e) {
    logger.error(e, 'queryKnowledgeBase error:')
  }
}
