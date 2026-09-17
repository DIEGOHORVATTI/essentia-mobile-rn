import { patientBundleSchema, type PatientBundle } from '@/contracts'

import { fhirFetch } from './fhir-fetch'

export async function fetchPatientBundle(url: string): Promise<PatientBundle> {
  const response = await fhirFetch(url)
  const json = (await response.json()) as unknown
  return patientBundleSchema.parse(json)
}
