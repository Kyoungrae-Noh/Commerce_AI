import SalesPlatformAdapter from '../base/SalesPlatformAdapter.js'

/**
 * 쿠팡 어댑터 (추후 구현)
 * 쿠팡은 공식 판매 데이터 API가 없어 리뷰 기반 추정 방식 사용 예정
 */
export default class CoupangAdapter extends SalesPlatformAdapter {
  constructor() {
    super('Coupang')
  }

  getPlatformFees() {
    return {
      coupangRocket: {
        name: '쿠팡 로켓그로스',
        commissionRate: 0.108,
        fulfillmentFee: 3500,
        returnRate: 0.05,
      }
    }
  }
}
