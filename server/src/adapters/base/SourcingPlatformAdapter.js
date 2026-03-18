/**
 * 소싱 플랫폼 어댑터 베이스 클래스
 * 새 소싱 플랫폼 추가 시 이 클래스를 상속하여 구현
 */
export default class SourcingPlatformAdapter {
  constructor(name) {
    this.name = name
  }

  /** 상품 검색 */
  async searchProduct(keyword) {
    throw new Error(`${this.name}: searchProduct not implemented`)
  }

  /** 예상 소싱가 조회 */
  async getEstimatedCost(keyword) {
    throw new Error(`${this.name}: getEstimatedCost not implemented`)
  }
}
