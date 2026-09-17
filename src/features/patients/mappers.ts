import type { PatientResource, ConditionResource, PatientBundle } from '@/contracts'

export type Patient = {
  id: string
  fullName: string
  initials: string
  gender: string
  genderLabel: string
  birthDate?: string
  age?: number
  location?: string
  phone?: string
  email?: string
  active: boolean
  avatarUrl: string
}

export type Condition = {
  id: string
  label: string
  status?: string
  verification?: string
  code?: string
  onset?: string
  date?: string
}

const CLINICAL_STATUS_PT: Record<string, string> = {
  active: 'Ativa',
  resolved: 'Resolvida',
  inactive: 'Inativa',
  remission: 'Em remissao',
  recurrence: 'Recorrencia',
}

const VERIFICATION_PT: Record<string, string> = {
  confirmed: 'Confirmada',
  provisional: 'Provisoria',
  unconfirmed: 'Nao confirmada',
  refuted: 'Refutada',
  differential: 'Diferencial',
}

function translateCode(
  dictionary: Record<string, string>,
  code: string | undefined,
): string | undefined {
  if (!code) return undefined
  return dictionary[code] ?? code
}

const GENDER_LABELS: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
  other: 'Outro',
  unknown: 'Nao informado',
}

export function fullNameFromFhir(name: PatientResource['name']): string {
  const primary = name?.[0]
  if (!primary) return 'Paciente sem nome'
  if (primary.text) return primary.text.trim()

  const given = primary.given?.join(' ') ?? ''
  const family = primary.family ?? ''
  const joined = `${given} ${family}`.trim()
  return joined.length > 0 ? joined : 'Paciente sem nome'
}

export function initialsFrom(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
}

/** Idade em anos completos a partir do birthDate (YYYY-MM-DD). */
export function ageFromBirthDate(
  birthDate: string | undefined,
  now: Date = new Date(),
): number | undefined {
  if (!birthDate) return undefined
  const born = new Date(birthDate)
  if (Number.isNaN(born.getTime())) return undefined

  let age = now.getFullYear() - born.getFullYear()
  const monthDiff = now.getMonth() - born.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < born.getDate())) {
    age -= 1
  }
  return age >= 0 && age < 140 ? age : undefined
}

export function avatarUrlFor(seed: string): string {
  const name = encodeURIComponent(seed.trim() || 'Paciente')
  return `https://ui-avatars.com/api/?name=${name}&background=b29b62&color=fff&size=160&bold=true&format=png`
}

function locationFromAddress(address: PatientResource['address']): string | undefined {
  const primary = address?.[0]
  if (!primary) return undefined
  const parts = [primary.city, primary.state].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : primary.country
}

function findTelecom(patient: PatientResource, system: string): string | undefined {
  return patient.telecom?.find((t) => t.system === system && t.value)?.value
}

export function toPatient(resource: PatientResource): Patient {
  const fullName = fullNameFromFhir(resource.name)
  const gender = resource.gender ?? 'unknown'

  return {
    id: resource.id,
    fullName,
    initials: initialsFrom(fullName),
    gender,
    genderLabel: GENDER_LABELS[gender] ?? 'Nao informado',
    birthDate: resource.birthDate,
    age: ageFromBirthDate(resource.birthDate),
    location: locationFromAddress(resource.address),
    phone: findTelecom(resource, 'phone'),
    email: findTelecom(resource, 'email'),
    active: resource.active ?? true,
    avatarUrl: avatarUrlFor(fullName),
  }
}

export function patientsFromBundle(bundle: PatientBundle): Patient[] {
  return (bundle.entry ?? [])
    .map((entry) => entry.resource)
    .filter((resource): resource is PatientResource => Boolean(resource?.id))
    .map(toPatient)
}

export function toCondition(resource: ConditionResource): Condition {
  const coding = resource.code?.coding?.[0]
  const label = resource.code?.text ?? coding?.display ?? 'Condicao sem descricao'

  return {
    id: resource.id,
    label,
    status: translateCode(CLINICAL_STATUS_PT, resource.clinicalStatus?.coding?.[0]?.code),
    verification: translateCode(VERIFICATION_PT, resource.verificationStatus?.coding?.[0]?.code),
    code: coding?.code,
    onset: resource.onsetDateTime,
    date: resource.recordedDate ?? resource.onsetDateTime,
  }
}
