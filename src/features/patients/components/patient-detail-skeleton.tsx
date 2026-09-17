import { LinearGradient } from 'expo-linear-gradient'
import { useWindowDimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useShimmer } from '@/hooks/use-shimmer'

export function PatientDetailSkeleton() {
  const { width } = useWindowDimensions()
  const shimmer = useShimmer(width)

  return (
    <View className="overflow-hidden">
      <View className="gap-6 p-4">
        <View className="flex-row items-center gap-4">
          <View className="h-[72px] w-[72px] rounded-full bg-bg-card" />
          <View className="flex-1 gap-2">
            <View className="h-6 w-2/3 rounded bg-bg-card" />
            <View className="h-4 w-24 rounded-full bg-bg-card" />
          </View>
        </View>
        <View className="h-12 w-40 rounded-xl bg-bg-card" />
        <View className="h-52 rounded-2xl bg-bg-card" />
        <View className="h-40 rounded-2xl bg-bg-card" />
      </View>
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: 0, bottom: 0, width: 100 }, shimmer]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.06)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  )
}
