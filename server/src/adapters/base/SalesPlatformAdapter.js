/**
 * 판매 플랫폼 어댑터 베이스 클래스
 * 새 판매 플랫폼 추가 시 이 클래스를 상속하여 구현
 */
export default class SalesPlatformAdapter {
  constructor(name) {
    this.name = name
  }

  /** 키워드 검색량, 트렌드, 경쟁자 수, 평균가 조회 */
  async searchKeyword(keyword) {
    throw new Error(`${this.name}: searchKeyword not implemented`)
  }

  /** 경쟁 분석 (난이도, 가격대, 상위 셀러) */
  async getCompetition(keyword) {
    throw new Error(`${this.name}: getCompetition not implemented`)
  }

  /** 플랫폼 수수료 정보 */
  getPlatformFees() {
    throw new Error(`${this.name}: getPlatformFees not implemented`)
  }
}
