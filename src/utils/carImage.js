import { useCallback, useRef } from 'react'

export const TYPE_IMAGES = {
  hatchback: '/cars/hatchback.jpg',
  sedan: '/cars/sedan.jpg',
  suv: '/cars/suv.jpg',
  luxury: '/cars/luxury.jpg',
}

export const DEFAULT_IMAGE = '/cars/luxury.jpg'

export function nameToSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export function getCarImageUrl(car) {
  if (car.photoURL) return car.photoURL

  const slug = nameToSlug(car.name || '')
  if (slug) {
    return `/cars/${slug}.jpg`
  }

  const type = (car.type || 'luxury').toLowerCase()
  return TYPE_IMAGES[type] || DEFAULT_IMAGE
}

function buildFallbackQueue(car) {
  const seen = new Set()
  const queue = []
  const slug = nameToSlug(car.name || '')
  const type = (car.type || 'luxury').toLowerCase()

  const pushUnique = (url) => {
    if (!seen.has(url)) {
      seen.add(url)
      queue.push(url)
    }
  }

  // Name-based non-jpg extensions (jpg already tried as initial src)
  if (slug) {
    pushUnique(`/cars/${slug}.png`)
    pushUnique(`/cars/${slug}.webp`)
  }

  // Type-based fallback
  if (TYPE_IMAGES[type]) {
    pushUnique(TYPE_IMAGES[type])
  }

  // Ultimate fallback
  pushUnique(DEFAULT_IMAGE)

  return queue
}

export function useCarImage(car) {
  const state = useRef({ carId: null, index: 0, queue: [] })
  const imgRef = useRef(null)

  if (state.current.carId !== (car.id || car.name)) {
    state.current = {
      carId: car.id || car.name,
      index: 0,
      queue: buildFallbackQueue(car),
    }
  }

  const src = getCarImageUrl(car)

  const handleError = useCallback(() => {
    const img = imgRef.current
    const { queue } = state.current
    if (!img || !queue) return

    let idx = state.current.index
    // Skip any entry that matches the URL that just failed
    while (idx < queue.length && queue[idx] === img.src) {
      idx++
    }
    if (idx < queue.length) {
      state.current.index = idx + 1
      if (import.meta.env.DEV) {
        console.log(`[CarImage] ${state.current.carId}: ${img.src} failed, trying ${queue[idx]}`)
      }
      img.src = queue[idx]
    }
  }, [])

  return { src, handleError, imgRef }
}
