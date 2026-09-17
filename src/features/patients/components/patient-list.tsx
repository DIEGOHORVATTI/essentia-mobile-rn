import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native'

import { useThemeColors } from '@/theme'
import { track } from '@/lib/analytics'
import { StateIcons, StateView } from '@/components/ui/state-view'

import { usePatients } from '../hooks/use-patients'
import type { PatientFilters } from '../filters'
import type { Patient } from '../mappers'
import { PatientCard } from './patient-card'
import { PatientListSkeleton } from './patient-list-skeleton'

type PatientListProps = {
  search: string
  filters: PatientFilters
}

export function PatientList({ search, filters }: PatientListProps) {
  const colors = useThemeColors()
  const router = useRouter()

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePatients(search, filters)

  const patients = data?.patients ?? []

  const openPatient = useCallback(
    (patient: Patient) => {
      track({ name: 'patient_open', id: patient.id })
      router.push(`/patient/${patient.id}`)
    },
    [router],
  )

  if (isLoading) return <PatientListSkeleton />

  if (isError) {
    return (
      <StateView
        icon={StateIcons.TriangleAlert}
        title="Nao foi possivel carregar"
        message="Verifique sua conexao e tente novamente."
        actionLabel="Tentar de novo"
        onAction={() => refetch()}
      />
    )
  }

  if (patients.length === 0) {
    return (
      <StateView
        icon={search.trim() ? StateIcons.SearchX : StateIcons.Users}
        title={search.trim() ? 'Nenhum paciente encontrado' : 'Sem pacientes'}
        message={
          search.trim()
            ? `Nada corresponde a "${search.trim()}". Tente outro nome.`
            : 'Nenhum paciente disponivel no momento.'
        }
      />
    )
  }

  return (
    <FlatList
      data={patients}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PatientCard patient={item} onPress={() => openPatient(item)} />}
      contentContainerClassName="px-4 pt-3 pb-8"
      ItemSeparatorComponent={() => <View className="h-2" />}
      onEndReachedThreshold={0.5}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
      }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  )
}
