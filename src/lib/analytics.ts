import { logger } from './logger'

type AnalyticsEvent =
  | { name: 'screen_view'; screen: string }
  | { name: 'patient_search'; term: string }
  | { name: 'patient_open'; id: string }
  | { name: 'patient_favorite_toggle'; id: string; favorited: boolean }

const enabled = process.env.EXPO_PUBLIC_ANALYTICS_DEBUG === 'true'

export function track(event: AnalyticsEvent): void {
  if (enabled) logger.info(`analytics:${event.name}`, event)
}

export function trackScreen(screen: string): void {
  track({ name: 'screen_view', screen })
}
