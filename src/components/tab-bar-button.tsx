import type { ReactNode } from 'react'
import type { AccessibilityState, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'

import { Pressable } from 'react-native'

type TabBarButtonProps = {
  children?: ReactNode
  onPress?: ((event: GestureResponderEvent) => void) | null
  onLongPress?: ((event: GestureResponderEvent) => void) | null
  accessibilityState?: AccessibilityState
  testID?: string
  style?: StyleProp<ViewStyle>
}

export function TabBarButton({
  children,
  onPress,
  onLongPress,
  accessibilityState,
  testID,
  style,
}: TabBarButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      testID={testID}
      android_ripple={{ color: 'transparent' }}
      style={(state) => [
        style,
        { alignItems: 'center', justifyContent: 'center', opacity: state.pressed ? 0.55 : 1 },
      ]}
    >
      {children}
    </Pressable>
  )
}
