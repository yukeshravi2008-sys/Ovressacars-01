import { copyFileSync, mkdirSync, readdirSync, existsSync, unlinkSync } from 'fs'
import { join, extname, parse, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SOURCE = join(__dirname, '..', 'cars img')
const DEST = join(__dirname, '..', 'public', 'cars')

const TYPE_KEYWORDS = ['hatchback', 'sedan', 'suv', 'luxury']

if (!existsSync(SOURCE)) {
  console.log('[sync-images] Source folder "cars img" not found, skipping.')
  process.exit(0)
}

if (!existsSync(DEST)) {
  mkdirSync(DEST, { recursive: true })
}

// Clear existing images for a clean sync
for (const file of readdirSync(DEST)) {
  unlinkSync(join(DEST, file))
}

const files = readdirSync(SOURCE)
let count = 0

for (const file of files) {
  const ext = extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext)) continue

  const baseName = parse(file).name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const srcPath = join(SOURCE, file)
  const normalizedName = baseName + ext
  const destPath = join(DEST, normalizedName)

  // Copy with original normalized name
  copyFileSync(srcPath, destPath)
  console.log(`[sync-images] ${file} -> ${normalizedName}`)
  count++

  // Also create type-based aliases if filename contains a type keyword
  for (const keyword of TYPE_KEYWORDS) {
    if (baseName.includes(keyword)) {
      const aliasName = keyword + ext
      const aliasPath = join(DEST, aliasName)
      // Only create alias if it doesn't already exist (first match wins)
      if (!existsSync(aliasPath)) {
        copyFileSync(srcPath, aliasPath)
        console.log(`[sync-images]   alias -> ${aliasName}`)
      }
    }
  }
}

console.log(`[sync-images] Synced ${count} image(s) with aliases to public/cars/`)
