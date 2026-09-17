import type { BottomSheetModal } from '@gorhom/bottom-sheet'

import { SlidersHorizontal } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { useThemeColors } from '@/theme'
import { Screen } from '@/components/ui/screen'
import { SearchBar } from '@/features/patients/components/search-bar'
import { PatientList } from '@/features/patients/components/patient-list'
import { FilterSheet } from '@/features/patients/components/filter-sheet'
import {
  activeFilterCount,
  DEFAULT_FILTERS,
  type PatientFilters,
} from '@/features/patients/filters'
import { useScreenView } from '@/hooks/use-screen-view'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

export default function PatientsScreen() {
  const colors = useThemeColors()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<PatientFilters>(DEFAULT_FILTERS)
  const debouncedSearch = useDebouncedValue(search, 450)
  const filterRef = useRef<BottomSheetModal>(null)

  useScreenView('patients_list')

  const count = activeFilterCount(filters)

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center gap-2 px-4 pt-3">
        <View className="flex-1">
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <Pressable
          onPress={() => filterRef.current?.present()}
          className="h-12 w-12 items-center justify-center rounded-xl border border-border bg-bg-card"
          accessibilityLabel="Abrir filtros"
        >
          <SlidersHorizontal size={20} color={colors.text} />
          {count > 0 ? (
            <View className="absolute -right-1 -top-1 h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1">
              <Text className="text-[11px] font-bold text-on-accent">{count}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <PatientList search={debouncedSearch} filters={filters} />

      <FilterSheet ref={filterRef} value={filters} onApply={setFilters} />
    </Screen>
  )
}
