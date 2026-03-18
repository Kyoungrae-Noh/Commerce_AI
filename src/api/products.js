import { post } from './client.js'

export function analyzeProduct(keyword) {
  return post('/products/analyze', { keyword })
}
