import { describe, expect, test } from 'bun:test'

import { formatDate } from './format'

describe('formatDate', () => {
  test('formata data ISO para pt-BR', () => {
    expect(formatDate('1958-09-23')).toBe('23/09/1958')
  })
  test('undefined para entrada ausente ou invalida', () => {
    expect(formatDate(undefined)).toBeUndefined()
    expect(formatDate('lixo')).toBeUndefined()
  })
})
