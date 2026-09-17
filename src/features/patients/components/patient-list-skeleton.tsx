import { LinearGradient } from 'expo-linear-gradient'
import { useWindowDimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'

import { useShimmer } from '@/hooks/use-shimmer'

const ROWS = Array.from({ length: 8 }, (_, index) => index)

type ShimmerStyle = ReturnType<typeof useShimmer>

function SkeletonCard({ shimmer }: { shimmer: ShimmerStyle }) {
  return (
    <View className="mb-2 overflow-hidden rounded-2xl border border-border bg-bg-secondary p-3">
      <View className="flex-row items-center gap-3">
        <View className="h-[52px] w-[52px] rounded-full bg-bg-card" />
        <View className="flex-1 gap-2">
          <View className="h-4 w-1/2 rounded bg-bg-card" />
          <View className="h-3 w-1/3 rounded bg-bg-card" />
          <View className="h-3 w-2/5 rounded bg-bg-card" />
        </View>
        <View className="h-5 w-5 rounded bg-bg-card" />
      </View>
      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', top: 0, bottom: 0, width: 90 }, shimmer]}
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

export function PatientListSkeleton() {
  const { width } = useWindowDimensions()
  const shimmer = useShimmer(width)

  return (
    <View className="px-4 pt-3">
      {ROWS.map((row) => (
        <SkeletonCard key={row} shimmer={shimmer} />
      ))}
    </View>
  )
}
