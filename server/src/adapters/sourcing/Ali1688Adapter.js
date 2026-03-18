import SourcingPlatformAdapter from '../base/SourcingPlatformAdapter.js'

/**
 * 1688 소싱 어댑터
 * MVP: 카테고리 기반 소싱가 추정
 * 향후: 1688 Open Platform API 또는 알리익스프레스 Affiliate API 연동
 */

// 카테고리별 평균 소싱가 비율 (판매가 대비)
const SOURCING_RATIO = {
  default: 0.30,       // 기본: 판매가의 30%
  electronics: 0.35,   // 전자기기
  fashion: 0.25,       // 패션
  beauty: 0.20,        // 뷰티
  living: 0.28,        // 생활용품
  pet: 0.32,           // 반려동물
  food: 0.40,          // 식품 (마진 낮음)
}

// 중국→한국 평균 배송비 (개당 예상)
const INTL_SHIPPING_ESTIMATE = {
  light: 1500,   // ~500g
  medium: 3000,  // 500g~2kg
  heavy: 5000,   // 2kg+
}

export default class Ali1688Adapter extends SourcingPlatformAdapter {
  constructor() {
    super('1688')
  }

  async getEstimatedCost(keyword, { avgSellingPrice = 0, category = 'default' } = {}) {
    const ratio = SOURCING_RATIO[category] || SOURCING_RATIO.default
    const estimatedSourcingPrice = Math.round(avgSellingPrice * ratio)
    const shippingEstimate = INTL_SHIPPING_ESTIMATE.medium

    return {
      source: '1688 (추정치)',
      estimatedPrice: estimatedSourcingPrice,
      priceRange: {
        min: Math.round(estimatedSourcingPrice * 0.7),
        max: Math.round(estimatedSourcingPrice * 1.4),
      },
      shippingEstimate,
      note: 'MVP 추정치입니다. 실제 1688 가격과 다를 수 있습니다.',
    }
  }
}
