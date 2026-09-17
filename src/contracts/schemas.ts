import { z } from 'zod'

export const humanNameSchema = z.object({
  text: z.string().optional(),
  family: z.string().optional(),
  given: z.array(z.string()).optional(),
  prefix: z.array(z.string()).optional(),
})

export const addressSchema = z.object({
  line: z.array(z.string()).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

export const telecomSchema = z.object({
  system: z.string().optional(),
  value: z.string().optional(),
  use: z.string().optional(),
})

export const patientResourceSchema = z.object({
  resourceType: z.literal('Patient').optional(),
  id: z.string(),
  active: z.boolean().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  deceasedBoolean: z.boolean().optional(),
  name: z.array(humanNameSchema).optional(),
  telecom: z.array(telecomSchema).optional(),
  address: z.array(addressSchema).optional(),
})

export const codeableConceptSchema = z.object({
  text: z.string().optional(),
  coding: z
    .array(
      z.object({
        code: z.string().optional(),
        display: z.string().optional(),
        system: z.string().optional(),
      }),
    )
    .optional(),
})

export const conditionResourceSchema = z.object({
  resourceType: z.literal('Condition').optional(),
  id: z.string(),
  code: codeableConceptSchema.optional(),
  clinicalStatus: codeableConceptSchema.optional(),
  verificationStatus: codeableConceptSchema.optional(),
  recordedDate: z.string().optional(),
  onsetDateTime: z.string().optional(),
})

export const bundleLinkSchema = z.object({
  relation: z.string(),
  url: z.string(),
})

function bundleOf<T extends z.ZodTypeAny>(resource: T) {
  return z.object({
    resourceType: z.literal('Bundle').optional(),
    type: z.string().optional(),
    total: z.number().optional(),
    link: z.array(bundleLinkSchema).optional().default([]),
    entry: z
      .array(z.object({ fullUrl: z.string().optional(), resource: resource.optional() }))
      .optional()
      .default([]),
  })
}

export const patientBundleSchema = bundleOf(patientResourceSchema)
export const conditionBundleSchema = bundleOf(conditionResourceSchema)

export const searchPatientsInputSchema = z.object({
  name: z.string().optional(),
  gender: z.string().optional(),
  active: z.boolean().optional(),
  'address-city': z.string().optional(),
  _count: z.number().int().positive().max(50).optional(),
  _sort: z.string().optional(),
})

export const getPatientInputSchema = z.object({
  id: z.string().min(1),
})

export const conditionsForPatientInputSchema = z.object({
  patient: z.string().min(1),
  _count: z.number().int().positive().max(50).optional(),
})

export type PatientResource = z.infer<typeof patientResourceSchema>
export type ConditionResource = z.infer<typeof conditionResourceSchema>
export type PatientBundle = z.infer<typeof patientBundleSchema>
export type ConditionBundle = z.infer<typeof conditionBundleSchema>
