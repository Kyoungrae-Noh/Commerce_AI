import { post } from './client.js'

export function checkRanking(keyword, storeName) {
  return post('/ranking/check', { keyword, storeName })
}

export function checkMultiRanking(keywords, storeName) {
  return post('/ranking/check-multi', { keywords, storeName })
}
