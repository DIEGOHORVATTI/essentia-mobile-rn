import '@/global.css'

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { palette, useIsDark } from '@/theme'
import { timeRangeToMs } from '@/lib/time'
import { queryClient } from '@/lib/query-client'
import { queryPersister } from '@/lib/query-persister'
import { SplashOverlay } from '@/components/splash-overlay'
import { useBoolean } from '@/hooks/use-boolean'
import { useAppStartup } from '@/hooks/use-app-startup'

SplashScreen.preventAutoHideAsync()

function navTheme(isDark: boolean): typeof DefaultTheme {
  const c = isDark ? palette.dark : palette.light
  const base = isDark ? DarkTheme : DefaultTheme
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.primary,
      background: c.background,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: c.danger,
    },
  }
}

export default function RootLayout() {
  const isDark = useIsDark()
  const splash = useBoolean(true)

  useAppStartup()

  const colors = isDark ? palette.dark : palette.light

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: queryPersister, maxAge: timeRangeToMs({ days: 1 }) }}
        >
          <ThemeProvider value={navTheme(isDark)}>
            <BottomSheetModalProvider>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.surface },
                  headerTintColor: colors.primary,
                  headerTitleStyle: { color: colors.text, fontWeight: '700' },
                  headerShadowVisible: false,
                  contentStyle: { backgroundColor: colors.background },
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="patient/[id]" options={{ title: 'Paciente' }} />
              </Stack>
              {splash.value ? <SplashOverlay onFinish={splash.onFalse} /> : null}
            </BottomSheetModalProvider>
          </ThemeProvider>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
