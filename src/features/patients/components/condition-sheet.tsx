import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import {
  CalendarClock,
  CalendarPlus,
  CircleDot,
  Hash,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react-native'
import { forwardRef, type ReactNode, useCallback } from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { formatDate } from '@/lib/format'
import { useThemeColors } from '@/theme'

import type { Condition } from '../mappers'

type ConditionSheetProps = {
  condition: Condition | null
}

export const ConditionSheet = forwardRef<BottomSheetModal, ConditionSheetProps>(
  function ConditionSheet({ condition }, ref) {
    const colors = useThemeColors()
    const insets = useSafeAreaInsets()

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
      ),
      [],
    )

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetView style={{ paddingBottom: insets.bottom + 24 }}>
          <View className="gap-4 px-6 pt-2">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft">
              <Stethoscope size={22} color={colors.primary} />
            </View>

            <Text className="text-xl font-bold text-text-primary">{condition?.label ?? '—'}</Text>

            <View className="gap-3 rounded-2xl border border-border bg-bg-card p-4">
              <Row
                icon={<Hash size={18} color={colors.textMuted} />}
                label="Codigo"
                value={condition?.code}
              />
              <Row
                icon={<CircleDot size={18} color={colors.textMuted} />}
                label="Status"
                value={condition?.status}
              />
              <Row
                icon={<ShieldCheck size={18} color={colors.textMuted} />}
                label="Verificacao"
                value={condition?.verification}
              />
              <Row
                icon={<CalendarPlus size={18} color={colors.textMuted} />}
                label="Inicio"
                value={formatDate(condition?.onset)}
              />
              <Row
                icon={<CalendarClock size={18} color={colors.textMuted} />}
                label="Registrado"
                value={formatDate(condition?.date)}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

function Row({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) {
  return (
    <View className="flex-row items-center gap-3">
      {icon}
      <Text className="w-24 text-base text-text-secondary">{label}</Text>
      <Text className="flex-1 text-right text-base text-text-primary" numberOfLines={2}>
        {value && value.length > 0 ? value : '—'}
      </Text>
    </View>
  )
}
