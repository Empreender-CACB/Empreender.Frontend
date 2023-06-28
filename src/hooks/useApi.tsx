import useSWR from 'swr'

import { api } from 'services/api'

export function useAPI({ url }) {
  const { data, error, mutate, isValidating } = useSWR(url, async (url) => {
    try {
      const response = await api.get(url)
      return response.data
    } catch (error) {
      return {
        data: null,
        error: 'Ocorreu um erro'
      }
    }
  })

  return { data, error, mutate, isValidating }
}
