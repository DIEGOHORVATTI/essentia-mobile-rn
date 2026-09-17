import { Stack, useLocalSearchParams } from 'expo-router'

import { Screen } from '@/components/ui/screen'
import { PatientDetail } from '@/features/patients/components/patient-detail'
import { StateView, StateIcons } from '@/components/ui/state-view'

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <>
      <Stack.Screen
        options={{ title: 'Detalhe do paciente', headerShown: true, headerBackVisible: true }}
      />
      <Screen edges={['bottom']}>
        {id ? (
          <PatientDetail id={id} />
        ) : (
          <StateView
            icon={StateIcons.TriangleAlert}
            title="Paciente invalido"
            message="ID nao informado."
          />
        )}
      </Screen>
    </>
  )
}
