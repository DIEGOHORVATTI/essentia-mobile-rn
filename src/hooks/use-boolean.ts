import { useCallback, useMemo, useState } from 'react'

export type UseBooleanReturn = {
  value: boolean
  setValue: (value: boolean) => void
  onTrue: () => void
  onFalse: () => void
  onToggle: () => void
}

export function useBoolean(initial = false): UseBooleanReturn {
  const [value, setValue] = useState(initial)

  const onTrue = useCallback(() => setValue(true), [])
  const onFalse = useCallback(() => setValue(false), [])
  const onToggle = useCallback(() => setValue((prev) => !prev), [])

  return useMemo(
    () => ({ value, setValue, onTrue, onFalse, onToggle }),
    [value, onTrue, onFalse, onToggle],
  )
}
