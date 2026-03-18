import { post, get } from './client.js'

export function calculateProfit(values, platform) {
  return post('/calculator/profit', { ...values, platform })
}

export function getPlatformFees() {
  return get('/calculator/fees')
}
