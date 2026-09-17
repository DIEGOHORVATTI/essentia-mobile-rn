import { createORPCClient } from '@orpc/client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'

import { FHIR_BASE_URL } from '@/constants/config'
import { contracts, type AppClient } from '@/contracts'

import { fhirFetch } from './fhir/fhir-fetch'

const link = new OpenAPILink(contracts, {
  url: FHIR_BASE_URL,
  fetch: (request, init) => fhirFetch(request as Request, init),
})

export const orpcClient: AppClient = createORPCClient(link)
