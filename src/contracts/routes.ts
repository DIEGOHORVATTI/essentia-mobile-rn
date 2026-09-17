import { base } from './errors'
import {
  patientBundleSchema,
  conditionBundleSchema,
  getPatientInputSchema,
  patientResourceSchema,
  searchPatientsInputSchema,
  conditionsForPatientInputSchema,
} from './schemas'

export const patients = base.router({
  search: base
    .route({
      method: 'GET',
      path: '/Patient',
      summary: 'Buscar pacientes',
      description: 'Lista pacientes com busca por nome e paginacao por offset',
    })
    .input(searchPatientsInputSchema)
    .output(patientBundleSchema),

  getById: base
    .route({
      method: 'GET',
      path: '/Patient/{id}',
      summary: 'Detalhe do paciente',
    })
    .input(getPatientInputSchema)
    .output(patientResourceSchema),
})

export const conditions = base.router({
  forPatient: base
    .route({
      method: 'GET',
      path: '/Condition',
      summary: 'Condicoes clinicas do paciente',
    })
    .input(conditionsForPatientInputSchema)
    .output(conditionBundleSchema),
})
