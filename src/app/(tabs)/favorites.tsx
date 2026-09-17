import { useRouter } from 'expo-router'
import { Heart } from 'lucide-react-native'
import { FlatList, Text, View } from 'react-native'

import { Screen } from '@/components/ui/screen'
import { StateView } from '@/components/ui/state-view'
import { PatientCard } from '@/features/patients/components/patient-card'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useScreenView } from '@/hooks/use-screen-view'

export default function FavoritesScreen() {
  const router = useRouter()
  const patients = useFavoritesStore((state) => state.patients)

  useScreenView('favorites')

  return (
    <Screen edges={['top']}>
      <View className="px-4 pb-2 pt-3">
        <Text className="text-2xl font-bold text-text-primary">Favoritos</Text>
      </View>

      {patients.length === 0 ? (
        <StateView
          icon={Heart}
          title="Nenhum favorito ainda"
          message="Toque no coracao de um paciente para salva-lo aqui."
        />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PatientCard patient={item} onPress={() => router.push(`/patient/${item.id}`)} />
          )}
          contentContainerClassName="px-4 pt-1 pb-8"
          ItemSeparatorComponent={() => <View className="h-2" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  )
}
