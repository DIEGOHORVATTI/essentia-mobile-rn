import { useColorScheme } from '@/hooks/use-color-scheme'

import { palette, type ThemeColors } from './colors'

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme()
  return scheme === 'dark' ? palette.dark : palette.light
}

export function useIsDark(): boolean {
  return useColorScheme() === 'dark'
}
