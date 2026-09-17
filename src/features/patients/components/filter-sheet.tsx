import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { forwardRef, type ReactNode, type RefObject, useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useThemeColors } from '@/theme'

import {
  DEFAULT_FILTERS,
  type PatientFilters,
  type SortOption,
  type StatusOption,
} from '../filters'
import { CityAutocomplete } from './city-autocomplete'

type FilterSheetProps = {
  value: PatientFilters
  onApply: (filters: PatientFilters) => void
}

type Option<T> = { label: string; value: T }

const GENDER_OPTIONS: Option<PatientFilters['gender']>[] = [
  { label: 'Todos', value: undefined },
  { label: 'Masculino', value: 'male' },
  { label: 'Feminino', value: 'female' },
]

const STATUS_OPTIONS: Option<StatusOption>[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Ativos', value: 'active' },
  { label: 'Inativos', value: 'inactive' },
]

const SORT_OPTIONS: Option<SortOption>[] = [
  { label: 'Nome', value: 'name' },
  { label: 'Mais novos', value: 'youngest' },
  { label: 'Mais velhos', value: 'oldest' },
]

export const FilterSheet = forwardRef<BottomSheetModal, FilterSheetProps>(function FilterSheet(
  { value, onApply },
  ref,
) {
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()
  const [draft, setDraft] = useState<PatientFilters>(value)

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  )

  const onChange = useCallback(
    (index: number) => {
      if (index >= 0) setDraft(value)
    },
    [value],
  )

  const dismiss = () => (ref as RefObject<BottomSheetModal>)?.current?.dismiss()

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      onChange={onChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView style={{ paddingBottom: insets.bottom + 10 }}>
        <View className="gap-5 px-6 pb-1 pt-2">
          <Text className="text-xl font-bold text-text-primary">Filtros</Text>

          <CityAutocomplete
            value={draft.city}
            onChange={(city) => setDraft((prev) => ({ ...prev, city }))}
          />

          <Group label="Genero">
            {GENDER_OPTIONS.map((option) => (
              <Chip
                key={option.label}
                label={option.label}
                selected={draft.gender === option.value}
                onPress={() => setDraft((prev) => ({ ...prev, gender: option.value }))}
              />
            ))}
          </Group>

          <Group label="Status">
            {STATUS_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={draft.status === option.value}
                onPress={() => setDraft((prev) => ({ ...prev, status: option.value }))}
              />
            ))}
          </Group>

          <Group label="Ordenar por">
            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={draft.sort === option.value}
                onPress={() => setDraft((prev) => ({ ...prev, sort: option.value }))}
              />
            ))}
          </Group>

          <View className="mt-2 flex-row gap-3">
            <Pressable
              className="flex-1 items-center rounded-xl border border-border py-3"
              onPress={() => setDraft(DEFAULT_FILTERS)}
            >
              <Text className="text-sm font-semibold text-text-secondary">Limpar</Text>
            </Pressable>
            <Pressable
              className="flex-1 items-center rounded-xl bg-primary py-3"
              onPress={() => {
                onApply(draft)
                dismiss()
              }}
            >
              <Text className="text-sm font-semibold text-on-accent">Aplicar</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase text-text-secondary">{label}</Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  )
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2 ${
        selected ? 'border-primary bg-primary-soft' : 'border-border bg-bg-card'
      }`}
    >
      <Text className={`text-base ${selected ? 'text-primary' : 'text-text-secondary'}`}>
        {label}
      </Text>
    </Pressable>
  )
}
