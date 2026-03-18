import { get } from './client.js'

export function getCompetition(keyword) {
  return get(`/competition/${encodeURIComponent(keyword)}`)
}
