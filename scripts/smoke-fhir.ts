import { fetchPatientBundle } from '@/lib/fhir/fetch-patient-bundle'
import { orpcClient } from '@/lib/orpc-client'

async function main() {
  console.log('1) search name=john')
  const page0 = await orpcClient.patients.search({ name: 'john', _count: 5, _sort: 'family' })
  console.log('   entries:', page0.entry.length)
  const first = page0.entry[0]?.resource
  console.log('   first:', JSON.stringify({ id: first?.id, name: first?.name?.[0]?.text }))

  const next = page0.link?.find((link) => link.relation === 'next')?.url
  console.log('2) cursor next?', Boolean(next))
  if (next) {
    const page1 = await fetchPatientBundle(next)
    console.log('   page1 entries:', page1.entry.length)
  }

  if (first?.id) {
    console.log('3) getById', first.id)
    const detail = await orpcClient.patients.getById({ id: first.id })
    console.log('   detail name:', detail.name?.[0]?.text, '| birthDate:', detail.birthDate)

    console.log('4) conditions.forPatient', first.id)
    const cond = await orpcClient.conditions.forPatient({ patient: first.id, _count: 5 })
    console.log(
      '   conditions:',
      cond.entry.map((e) => e.resource?.code?.text ?? e.resource?.code?.coding?.[0]?.display),
    )
  }

  console.log('\nOK: oRPC + FHIR funcionando.')
}

main().catch((err) => {
  console.error('FALHOU:', err)
  process.exit(1)
})
