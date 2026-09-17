import type { Patient } from '@/features/patients/mappers'

export function parsePatients(raw: string | null): Patient[] {
  try {
    const parsed = JSON.parse(raw ?? '[]')
    return Array.isArray(parsed) ? (parsed as Patient[]) : []
  } catch {
    return []
  }
}
