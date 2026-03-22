import { get, post } from './client.js'

export function analyzeProduct(keyword) {
  return post('/products/analyze', { keyword })
}

export function getTrending(category = null) {
  const params = category ? `?category=${category}` : ''
  return get(`/products/trending${params}`)
}

export function refreshTrending() {
  return post('/products/trending/refresh', {})
}

export function getBestSellers(category = null) {
  const params = category ? `?category=${category}` : ''
  return get(`/products/best-sellers${params}`)
}
