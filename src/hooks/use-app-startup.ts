import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { useFavoritesStore } from '@/stores/favorites-store'

export function useAppStartup() {
  const hydrate = useFavoritesStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
    SplashScreen.hideAsync().catch(() => {})
  }, [hydrate])
}
