export type ThemeColors = {
  primary: string
  primaryDark: string
  primarySoft: string
  onPrimary: string
  background: string
  surface: string
  surfaceAlt: string
  border: string
  text: string
  textSecondary: string
  textMuted: string
  success: string
  warning: string
  danger: string
  skeleton: string
  overlay: string
}

export const palette: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    primary: '#b29b62',
    primaryDark: '#8f7d4e',
    primarySoft: '#efe7d3',
    onPrimary: '#14120c',

    background: '#f5f1ed',
    surface: '#ffffff',
    surfaceAlt: '#efe9e1',
    border: '#e4ddd2',

    text: '#222222',
    textSecondary: '#626262',
    textMuted: '#8a857c',

    success: '#3f7d5f',
    warning: '#b58a3c',
    danger: '#c04a3f',

    skeleton: '#ece6dc',
    overlay: 'rgba(20, 18, 12, 0.45)',
  },
  dark: {
    primary: '#c4ad72',
    primaryDark: '#b29b62',
    primarySoft: '#2b2a20',
    onPrimary: '#14120c',

    background: '#0c1112',
    surface: '#141b1d',
    surfaceAlt: '#1c2426',
    border: '#26312f',

    text: '#f1f5f5',
    textSecondary: '#b4c0c0',
    textMuted: '#7c8a8a',

    success: '#4fb489',
    warning: '#d9b45f',
    danger: '#e08a80',

    skeleton: '#1e2729',
    overlay: 'rgba(0, 0, 0, 0.55)',
  },
}
