type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type Logger = Record<LogLevel, (message: string, meta?: unknown) => void>

const isDev = process.env.NODE_ENV !== 'production'

function emit(level: LogLevel, message: string, meta?: unknown) {
  if (!isDev && level === 'debug') return
  const line = `[${level}] ${message}`
  if (meta === undefined) console[level](line)
  else console[level](line, meta)
}

export const logger: Logger = {
  debug: (message, meta) => emit('debug', message, meta),
  info: (message, meta) => emit('info', message, meta),
  warn: (message, meta) => emit('warn', message, meta),
  error: (message, meta) => emit('error', message, meta),
}
