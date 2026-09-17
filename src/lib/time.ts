export type TimeRange = Partial<{
  days: number
  hours: number
  minutes: number
  seconds: number
}>

const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR
const MS_IN_SECOND = 1000

export function timeRangeToSeconds({
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: TimeRange): number {
  return days * SECONDS_IN_DAY + hours * SECONDS_IN_HOUR + minutes * SECONDS_IN_MINUTE + seconds
}

export function timeRangeToMs(range: TimeRange): number {
  return timeRangeToSeconds(range) * MS_IN_SECOND
}
