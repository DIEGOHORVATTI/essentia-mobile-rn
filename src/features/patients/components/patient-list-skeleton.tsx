import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { usePulse } from '@/hooks/use-pulse'

const ROWS = Array.from({ length: 7 }, (_, index) => index)

export function PatientListSkeleton() {
  const pulse = usePulse()

  return (
    <View className="px-4 pt-3">
      {ROWS.map((row) => (
        <View
          key={row}
          className="mb-2 flex-row items-center gap-3 rounded-2xl border border-border bg-bg-secondary p-3"
        >
          <Animated.View className="h-[52px] w-[52px] rounded-full bg-bg-card" style={pulse} />
          <View className="flex-1 gap-2">
            <Animated.View className="h-4 w-1/2 rounded bg-bg-card" style={pulse} />
            <Animated.View className="h-3 w-1/3 rounded bg-bg-card" style={pulse} />
            <Animated.View className="h-3 w-2/5 rounded bg-bg-card" style={pulse} />
          </View>
        </View>
      ))}
    </View>
  )
}
