import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const OUT = join(import.meta.dir, '..', 'assets', 'images')

const GRAD_TOP = '#c4ad72'
const GRAD_BOTTOM = '#8f7d4e'

const E_PATH = 'M350 152 H160 V360 H350 M160 256 H322'

const gradientDef = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${GRAD_TOP}"/>
      <stop offset="1" stop-color="${GRAD_BOTTOM}"/>
    </linearGradient>
  </defs>`

function mark(scale: number, color: string): string {
  const t = 256 * (1 - scale)
  return `<g transform="translate(${t} ${t}) scale(${scale})">
    <path d="${E_PATH}" fill="none" stroke="${color}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`
}

function svg(size: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">${body}</svg>`
}

const iconSvg = (size: number) =>
  svg(
    size,
    `${gradientDef}<rect width="512" height="512" fill="url(#bg)"/>${mark(1.45, '#FFFFFF')}`,
  )

const backgroundSvg = (size: number) =>
  svg(size, `${gradientDef}<rect width="512" height="512" fill="url(#bg)"/>`)

const foregroundSvg = (size: number) => svg(size, mark(1.2, '#FFFFFF'))

const splashSvg = (size: number) => svg(size, mark(1.35, '#FFFFFF'))

async function png(source: string, size: number, file: string) {
  await sharp(Buffer.from(source)).resize(size, size).png().toFile(join(OUT, file))
  console.log('  ok', file, `${size}px`)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  console.log('Gerando assets de marca (S)...')
  await png(iconSvg(1024), 1024, 'icon.png')
  await png(iconSvg(196), 196, 'favicon.png')
  await png(backgroundSvg(1024), 1024, 'android-icon-background.png')
  await png(foregroundSvg(1024), 1024, 'android-icon-foreground.png')
  await png(foregroundSvg(1024), 1024, 'android-icon-monochrome.png')
  await png(splashSvg(512), 512, 'splash-icon.png')
  console.log('Concluido.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
