import { readFileSync } from 'node:fs'

const files = [...new Bun.Glob('src/**/*.{ts,tsx}').scanSync('.')]

const offenders = files.filter((file) => {
  if (file.includes('/hooks/') || /\.test\.(ts|tsx)$/.test(file)) return false
  return /\buseEffect\s*\(/.test(readFileSync(file, 'utf8'))
})

if (offenders.length > 0) {
  console.error('\nuseEffect fora de um hook (extraia para src/hooks ou **/hooks):\n')
  for (const file of offenders) console.error(`  - ${file}`)
  process.exit(1)
}

console.log('OK: useEffect apenas em hooks')
