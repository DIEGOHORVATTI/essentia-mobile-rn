import { View } from 'react-native'
import Animated from 'react-native-reanimated'

import { usePulse } from '@/hooks/use-pulse'

export function PatientDetailSkeleton() {
  const pulse = usePulse()

  return (
    <View className="gap-6 p-4">
      <View className="flex-row items-center gap-4">
        <Animated.View className="h-[72px] w-[72px] rounded-full bg-bg-card" style={pulse} />
        <View className="flex-1 gap-2">
          <Animated.View className="h-6 w-2/3 rounded bg-bg-card" style={pulse} />
          <Animated.View className="h-4 w-24 rounded-full bg-bg-card" style={pulse} />
        </View>
      </View>
      <Animated.View className="h-12 w-40 rounded-xl bg-bg-card" style={pulse} />
      <Animated.View className="h-52 rounded-2xl bg-bg-card" style={pulse} />
      <Animated.View className="h-40 rounded-2xl bg-bg-card" style={pulse} />
    </View>
  )
}
