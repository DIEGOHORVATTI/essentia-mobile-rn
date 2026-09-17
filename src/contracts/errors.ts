import { oc } from '@orpc/contract'

export const COMMON_ERRORS = {
  NOT_FOUND: {
    status: 404,
    message: 'Recurso nao encontrado',
  },
  BAD_REQUEST: {
    status: 400,
    message: 'Requisicao invalida',
  },
  UPSTREAM_UNAVAILABLE: {
    status: 503,
    message: 'Servidor FHIR indisponivel',
  },
} as const

export const base = oc.errors(COMMON_ERRORS)
