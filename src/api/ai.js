import { post } from './client.js'

export function analyzeKeyword(keyword) {
  return post('/ai/analyze', { keyword })
}
