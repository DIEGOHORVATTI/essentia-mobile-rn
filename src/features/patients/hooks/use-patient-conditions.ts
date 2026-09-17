import { useQuery } from '@tanstack/react-query'

import { qk } from '@/lib/query-keys'
import { orpcClient } from '@/lib/orpc-client'

import { toCondition } from '../mappers'

export function usePatientConditions(id: string) {
  return useQuery({
    queryKey: qk.patients.conditions(id),
    queryFn: async () => {
      const bundle = await orpcClient.conditions.forPatient({ patient: id, _count: 20 })
      return (bundle.entry ?? [])
        .map((entry) => entry.resource)
        .filter((resource) => Boolean(resource?.id))
        .map((resource) => toCondition(resource!))
    },
    enabled: id.length > 0,
  })
}
