export const qk = {
  patients: {
    root: ['patients'] as const,
    list: (search: string, filters: unknown) => ['patients', 'list', search, filters] as const,
    map: ['patients', 'map'] as const,
    detail: (id: string) => ['patients', 'detail', id] as const,
    conditions: (id: string) => ['patients', 'conditions', id] as const,
  },
} as const
