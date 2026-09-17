import type { ReactNode } from 'react'

import { type Edge, SafeAreaView } from 'react-native-safe-area-context'

type ScreenProps = {
  children: ReactNode
  edges?: readonly Edge[]
}

export function Screen({ children, edges = ['top', 'bottom'] }: ScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-bg-primary" edges={edges}>
      {children}
    </SafeAreaView>
  )
}
