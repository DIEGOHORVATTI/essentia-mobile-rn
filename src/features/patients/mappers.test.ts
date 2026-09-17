import { describe, expect, test } from 'bun:test'

import type { PatientResource, PatientBundle } from '@/contracts'

import {
  toPatient,
  toCondition,
  initialsFrom,
  avatarUrlFor,
  ageFromBirthDate,
  fullNameFromFhir,
  patientsFromBundle,
} from './mappers'

describe('fullNameFromFhir', () => {
  test('usa text quando presente', () => {
    expect(fullNameFromFhir([{ text: 'Maria E. Sanchez' }])).toBe('Maria E. Sanchez')
  })

  test('monta a partir de given + family', () => {
    expect(fullNameFromFhir([{ given: ['Joao', 'P'], family: 'Silva' }])).toBe('Joao P Silva')
  })

  test('fallback quando vazio', () => {
    expect(fullNameFromFhir(undefined)).toBe('Paciente sem nome')
    expect(fullNameFromFhir([{}])).toBe('Paciente sem nome')
  })
})

describe('initialsFrom', () => {
  test('duas iniciais de nome composto', () => {
    expect(initialsFrom('Maria Sanchez')).toBe('MS')
  })
  test('uma inicial de nome unico', () => {
    expect(initialsFrom('Madonna')).toBe('M')
  })
  test('nome vazio', () => {
    expect(initialsFrom('   ')).toBe('?')
  })
})

describe('ageFromBirthDate', () => {
  const now = new Date('2026-09-17')

  test('calcula idade em anos completos', () => {
    expect(ageFromBirthDate('1958-09-23', now)).toBe(67)
  })
  test('considera aniversario ja passado', () => {
    expect(ageFromBirthDate('1958-01-01', now)).toBe(68)
  })
  test('undefined para data invalida ou ausente', () => {
    expect(ageFromBirthDate(undefined, now)).toBeUndefined()
    expect(ageFromBirthDate('nao-e-data', now)).toBeUndefined()
  })
})

describe('avatarUrlFor', () => {
  test('gera url com nome url-encoded', () => {
    expect(avatarUrlFor('Maria Sanchez')).toContain('name=Maria%20Sanchez')
    expect(avatarUrlFor('Maria Sanchez')).toContain('ui-avatars.com')
  })
})

describe('toPatient', () => {
  const resource: PatientResource = {
    id: '123',
    name: [{ text: 'Maria Sanchez' }],
    gender: 'female',
    birthDate: '1990-05-10',
    address: [{ city: 'Recife', state: 'PE' }],
    telecom: [
      { system: 'phone', value: '81999998888' },
      { system: 'email', value: 'maria@example.com' },
    ],
  }

  test('mapeia recurso completo para dominio', () => {
    const patient = toPatient(resource)
    expect(patient.id).toBe('123')
    expect(patient.fullName).toBe('Maria Sanchez')
    expect(patient.initials).toBe('MS')
    expect(patient.genderLabel).toBe('Feminino')
    expect(patient.location).toBe('Recife, PE')
    expect(patient.phone).toBe('81999998888')
    expect(patient.email).toBe('maria@example.com')
    expect(patient.active).toBe(true)
  })

  test('genero desconhecido vira rotulo neutro', () => {
    expect(toPatient({ id: '1' }).genderLabel).toBe('Nao informado')
  })
})

describe('patientsFromBundle', () => {
  test('extrai e filtra entradas sem recurso', () => {
    const bundle: PatientBundle = {
      link: [],
      entry: [{ resource: { id: 'a', name: [{ text: 'A B' }] } }, { resource: undefined }, {}],
    }
    const patients = patientsFromBundle(bundle)
    expect(patients).toHaveLength(1)
    expect(patients[0].id).toBe('a')
  })
})

describe('toCondition', () => {
  test('prioriza code.text', () => {
    const c = toCondition({ id: 'c1', code: { text: 'Diabetes' }, recordedDate: '2020-01-01' })
    expect(c.label).toBe('Diabetes')
    expect(c.date).toBe('2020-01-01')
  })
  test('usa display do coding quando nao ha text', () => {
    const c = toCondition({ id: 'c2', code: { coding: [{ display: 'Hipertensao' }] } })
    expect(c.label).toBe('Hipertensao')
  })
})
