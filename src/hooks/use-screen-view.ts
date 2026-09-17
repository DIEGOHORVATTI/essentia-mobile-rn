import { useEffect } from 'react'

import { trackScreen } from '@/lib/analytics'

export function useScreenView(name: string) {
  useEffect(() => trackScreen(name), [name])
}
