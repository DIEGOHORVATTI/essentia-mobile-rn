import { getAnalytics, logEvent, logScreenView } from '@react-native-firebase/analytics'

import { logger } from './logger'

type AnalyticsEvent =
  | { name: 'screen_view'; screen: string }
  | { name: 'patient_search'; term: string }
  | { name: 'patient_open'; id: string }
  | { name: 'patient_favorite_toggle'; id: string; favorited: boolean }

const debug = process.env.EXPO_PUBLIC_ANALYTICS_DEBUG === 'true'

function toParams(event: Record<string, unknown>): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(event)
      .filter(([key]) => key !== 'name')
      .map(([key, value]) => [key, typeof value === 'number' ? value : String(value)]),
  )
}

async function report(event: AnalyticsEvent): Promise<void> {
  const analytics = getAnalytics()

  if (event.name === 'screen_view') {
    await logScreenView(analytics, { screen_name: event.screen, screen_class: event.screen })
    return
  }

  await logEvent(analytics, event.name, toParams(event))
}

export function track(event: AnalyticsEvent): void {
  report(event).catch(() => {
    if (debug) logger.info(`analytics:${event.name}`, event)
  })
}

export function trackScreen(screen: string): void {
  track({ name: 'screen_view', screen })
}
