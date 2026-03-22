import { post } from './client.js'

export function searchSourcing(keyword) {
  return post('/sourcing/search', { keyword })
}
