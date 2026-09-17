import { useRouter } from 'expo-router'
import { MapPinned } from 'lucide-react-native'
import { ActivityIndicator, Text, View } from 'react-native'

import { useThemeColors } from '@/theme'
import { Screen } from '@/components/ui/screen'
import { StateIcons, StateView } from '@/components/ui/state-view'
import { PatientMap } from '@/features/patients/components/patient-map'
import { usePatientsMap } from '@/features/patients/hooks/use-patients-map'
import { useScreenView } from '@/hooks/use-screen-view'

export default function MapScreen() {
  const router = useRouter()
  const colors = useThemeColors()
  const { data, isLoading, isError, refetch } = usePatientsMap()

  useScreenView('map')

  return (
    <Screen edges={['top']}>
      <View className="px-4 pb-2 pt-3">
        <Text className="text-2xl font-bold text-text-primary">Mapa</Text>
        <Text className="text-xs text-text-muted">Pacientes por localizacao</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : isError || !data ? (
        <StateView
          icon={StateIcons.TriangleAlert}
          title="Nao foi possivel carregar o mapa"
          message="Verifique sua conexao e tente novamente."
          actionLabel="Tentar de novo"
          onAction={() => refetch()}
        />
      ) : data.length === 0 ? (
        <StateView
          icon={MapPinned}
          title="Sem localizacao"
          message="Nenhum paciente com coordenadas disponiveis."
        />
      ) : (
        <PatientMap patients={data} onSelect={(id) => router.push(`/patient/${id}`)} />
      )}
    </Screen>
  )
}
