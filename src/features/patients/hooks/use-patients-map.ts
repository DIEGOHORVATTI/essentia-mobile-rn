import { useQuery } from '@tanstack/react-query'

import { qk } from '@/lib/query-keys'
import { orpcClient } from '@/lib/orpc-client'

import { patientsFromBundle, type Patient } from '../mappers'

export type GeoPatient = Patient & { lat: number; lng: number }

export function usePatientsMap() {
  return useQuery({
    queryKey: qk.patients.map,
    queryFn: async (): Promise<GeoPatient[]> => {
      const bundle = await orpcClient.patients.search({ _count: 50, _sort: 'family' })
      return patientsFromBundle(bundle).filter(
        (patient): patient is GeoPatient => patient.lat != null && patient.lng != null,
      )
    },
  })
}
