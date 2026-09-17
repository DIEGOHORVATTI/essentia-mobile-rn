import { QueryClient } from '@tanstack/react-query'

import { timeRangeToMs } from './time'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: timeRangeToMs({ minutes: 5 }),
      gcTime: timeRangeToMs({ days: 1 }),
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})
