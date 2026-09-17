import type { AppInputs } from '@/contracts'

import { useInfiniteQuery } from '@tanstack/react-query'

import { PAGE_SIZE } from '@/constants/config'
import { fetchPatientBundle } from '@/lib/fhir/fetch-patient-bundle'
import { orpcClient } from '@/lib/orpc-client'
import { qk } from '@/lib/query-keys'

import { SORT_PARAM, statusToActive, type PatientFilters } from '../filters'
import { patientsFromBundle, type Patient } from '../mappers'

type PatientPage = {
  patients: Patient[]
  next: string | undefined
}

function nextLink(bundle: { link?: { relation: string; url: string }[] }): string | undefined {
  return bundle.link?.find((link) => link.relation === 'next')?.url
}

export function usePatients(search: string, filters: PatientFilters) {
  const trimmed = search.trim()

  return useInfiniteQuery({
    queryKey: qk.patients.list(trimmed, filters),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }): Promise<PatientPage> => {
      const params: AppInputs['patients']['search'] = {
        name: trimmed || undefined,
        gender: filters.gender,
        active: statusToActive(filters.status),
        'address-city': filters.city?.trim() || undefined,
        _count: PAGE_SIZE,
        _sort: SORT_PARAM[filters.sort],
      }

      const bundle = pageParam
        ? await fetchPatientBundle(pageParam)
        : await orpcClient.patients.search(params)

      return { patients: patientsFromBundle(bundle), next: nextLink(bundle) }
    },
    getNextPageParam: (lastPage) => lastPage.next,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      patients: data.pages.flatMap((page) => page.patients),
    }),
  })
}
