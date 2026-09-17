import { useEffect } from 'react'
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

export function useShimmer(width: number) {
  const translateX = useSharedValue(-width)

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration: 1100, easing: Easing.linear }),
      -1,
      false,
    )
  }, [translateX, width])

  return useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }))
}
