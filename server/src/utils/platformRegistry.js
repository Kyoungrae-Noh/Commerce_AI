import NaverAdapter from '../adapters/sales/NaverAdapter.js'
import CoupangAdapter from '../adapters/sales/CoupangAdapter.js'
import Ali1688Adapter from '../adapters/sourcing/Ali1688Adapter.js'

// 판매 플랫폼
const salesAdapters = {
  naver: new NaverAdapter(),
  coupang: new CoupangAdapter(),
}

// 소싱 플랫폼
const sourcingAdapters = {
  ali1688: new Ali1688Adapter(),
}

export function getSalesAdapter(platform) {
  return salesAdapters[platform]
}

export function getSourcingAdapter(platform) {
  return sourcingAdapters[platform]
}

export function getAllPlatformFees() {
  const fees = {}
  for (const adapter of Object.values(salesAdapters)) {
    Object.assign(fees, adapter.getPlatformFees())
  }
  return fees
}
