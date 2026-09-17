import { ChevronRight, Heart, MapPin } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { useThemeColors } from '@/theme'
import { useFavoritesStore } from '@/stores/favorites-store'

import type { Patient } from '../mappers'
import { PatientAvatar } from './patient-avatar'

type PatientCardProps = {
  patient: Patient
  onPress: () => void
}

export function PatientCard({ patient, onPress }: PatientCardProps) {
  const colors = useThemeColors()
  const toggle = useFavoritesStore((state) => state.toggle)
  const isFavorite = useFavoritesStore((state) =>
    state.patients.some((item) => item.id === patient.id),
  )

  const description = [patient.genderLabel, patient.age != null ? `${patient.age} anos` : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-bg-secondary p-3 active:opacity-90"
    >
      <PatientAvatar uri={patient.avatarUrl} initials={patient.initials} />

      <View className="flex-1 gap-0.5">
        <Text className="text-base font-semibold text-text-primary" numberOfLines={1}>
          {patient.fullName}
        </Text>
        <Text className="text-xs text-text-secondary" numberOfLines={1}>
          {description}
        </Text>
        {patient.location ? (
          <View className="mt-0.5 flex-row items-center gap-1">
            <MapPin size={12} color={colors.textMuted} />
            <Text className="text-xs text-text-muted" numberOfLines={1}>
              {patient.location}
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => toggle(patient)}
        className="p-1"
        accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart
          size={20}
          color={isFavorite ? colors.danger : colors.textMuted}
          fill={isFavorite ? colors.danger : 'transparent'}
        />
      </Pressable>

      <ChevronRight size={18} color={colors.textMuted} />
    </Pressable>
  )
}
