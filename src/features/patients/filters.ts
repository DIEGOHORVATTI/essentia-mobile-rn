export type SortOption = 'name' | 'youngest' | 'oldest'
export type StatusOption = 'all' | 'active' | 'inactive'

export type PatientFilters = {
  gender?: 'male' | 'female'
  city?: string
  status: StatusOption
  sort: SortOption
}

export const DEFAULT_FILTERS: PatientFilters = { status: 'all', sort: 'name' }

export const SORT_PARAM: Record<SortOption, string> = {
  name: 'family',
  youngest: '-birthdate',
  oldest: 'birthdate',
}

export function statusToActive(status: StatusOption): boolean | undefined {
  if (status === 'all') return undefined
  return status === 'active'
}

export function activeFilterCount(filters: PatientFilters): number {
  return (
    (filters.gender ? 1 : 0) +
    (filters.city?.trim() ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.sort !== 'name' ? 1 : 0)
  )
}
