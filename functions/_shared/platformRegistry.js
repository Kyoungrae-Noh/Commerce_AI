import { createNaverAdapter, createCoupangAdapter, createAli1688Adapter } from './adapters.js'

export function createPlatformRegistry(env) {
  const salesAdapters = {
    naver: createNaverAdapter(env),
    coupang: createCoupangAdapter(),
  }

  const sourcingAdapters = {
    ali1688: createAli1688Adapter(),
  }

  return {
    getSalesAdapter(platform) {
      return salesAdapters[platform]
    },
    getSourcingAdapter(platform) {
      return sourcingAdapters[platform]
    },
    getAllPlatformFees() {
      const fees = {}
      for (const adapter of Object.values(salesAdapters)) {
        Object.assign(fees, adapter.getPlatformFees())
      }
      return fees
    },
  }
}
