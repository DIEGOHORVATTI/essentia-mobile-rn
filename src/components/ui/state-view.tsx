import { type LucideIcon, SearchX, TriangleAlert, Users } from 'lucide-react-native'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

import { useThemeColors } from '@/theme'

type StateViewProps = {
  icon: LucideIcon
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function StateView({ icon: Icon, title, message, actionLabel, onAction }: StateViewProps) {
  const colors = useThemeColors()

  return (
    <View className="flex-1 items-center justify-center gap-3 p-6">
      <View className="mb-1 h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
        <Icon size={28} color={colors.primary} />
      </View>
      <Text className="text-lg font-semibold text-text-primary">{title}</Text>
      {message ? (
        <Text className="max-w-[300px] text-center text-base text-text-muted">{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          className="mt-2 rounded-xl bg-primary px-6 py-3 active:opacity-85"
        >
          <Text className="text-sm font-semibold text-on-accent">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export function LoadingView({ label }: { label?: string }) {
  const colors = useThemeColors()
  return (
    <View className="flex-1 items-center justify-center gap-3 p-6">
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text className="text-center text-base text-text-muted">{label}</Text> : null}
    </View>
  )
}

export const StateIcons = { SearchX, TriangleAlert, Users }
