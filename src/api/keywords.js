import { get } from './client.js'

export function searchKeyword(keyword) {
  return get(`/keywords/search?q=${encodeURIComponent(keyword)}`)
}

export function getTrendingKeywords() {
  return get('/keywords/trending')
}
