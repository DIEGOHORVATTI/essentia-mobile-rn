import { useEffect } from 'react'
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

export function useSplashAnimation(onFinish: () => void) {
  const opacity = useSharedValue(1)
  const logoScale = useSharedValue(0.8)
  const logoOpacity = useSharedValue(0)
  const textOpacity = useSharedValue(0)

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })
    logoScale.value = withSequence(
      withTiming(1.04, { duration: 550, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 350, easing: Easing.inOut(Easing.quad) }),
    )
    textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }))

    opacity.value = withDelay(
      1400,
      withTiming(0, { duration: 450, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(onFinish)()
      }),
    )
  }, [logoOpacity, logoScale, textOpacity, opacity, onFinish])

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }))
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }))

  return { containerStyle, logoStyle, textStyle }
}
