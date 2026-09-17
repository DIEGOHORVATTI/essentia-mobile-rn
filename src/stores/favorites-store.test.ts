import { describe, expect, test } from 'bun:test'

import { parsePatients } from './favorites-parse'

describe('parsePatients', () => {
  test('array valido volta como esta', () => {
    const raw = JSON.stringify([{ id: 'a', fullName: 'A B' }])
    expect(parsePatients(raw)).toHaveLength(1)
  })
  test('null ou json invalido retorna vazio', () => {
    expect(parsePatients(null)).toEqual([])
    expect(parsePatients('{oops')).toEqual([])
    expect(parsePatients('{"nao":"array"}')).toEqual([])
  })
})
