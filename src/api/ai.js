import { post } from './client.js'

export function analyzeKeyword(keyword, category) {
  return post('/ai/analyze', { keyword, category })
}
