import { useQuery } from '@tanstack/react-query'

import { qk } from '@/lib/query-keys'
import { orpcClient } from '@/lib/orpc-client'

import { toPatient } from '../mappers'

export function usePatient(id: string) {
  return useQuery({
    queryKey: qk.patients.detail(id),
    queryFn: async () => {
      const resource = await orpcClient.patients.getById({ id })
      return toPatient(resource)
    },
    enabled: id.length > 0,
  })
}
