// ── 카테고리 ──
export const categories = [
  { id: 'all', label: '전체' },
  { id: 'living', label: '생활용품' },
  { id: 'electronics', label: '전자기기' },
  { id: 'beauty', label: '뷰티' },
  { id: 'fashion', label: '패션' },
  { id: 'food', label: '식품' },
  { id: 'pet', label: '반려동물' },
]

// ── 상품 추천 ──
export const mockProducts = [
  {
    id: 1, rank: 1, name: '미니 가습기 USB 타입', category: 'living',
    icon: '🌱', iconBg: 'rgba(0,229,160,0.1)',
    sourcelyScore: 94,
    scores: { demand: 92, competition: 88, margin: 96, trend: 91 },
    verdict: 'recommended',
    avgPrice: 15900, estimatedMargin: 42,
    monthlySearchVolume: 48200, competitorCount: 124,
  },
  {
    id: 2, rank: 2, name: '블루투스 넥밴드 이어폰', category: 'electronics',
    icon: '🎧', iconBg: 'rgba(0,87,255,0.1)',
    sourcelyScore: 88,
    scores: { demand: 90, competition: 72, margin: 85, trend: 94 },
    verdict: 'recommended',
    avgPrice: 24900, estimatedMargin: 35,
    monthlySearchVolume: 38100, competitorCount: 312,
  },
  {
    id: 3, rank: 3, name: '퍼스널컬러 진단 키트', category: 'beauty',
    icon: '🧴', iconBg: 'rgba(255,77,109,0.1)',
    sourcelyScore: 82,
    scores: { demand: 78, competition: 92, margin: 80, trend: 88 },
    verdict: 'recommended',
    avgPrice: 12900, estimatedMargin: 51,
    monthlySearchVolume: 22400, competitorCount: 67,
  },
  {
    id: 4, rank: 4, name: '강아지 자동 급식기', category: 'pet',
    icon: '🐕', iconBg: 'rgba(255,200,0,0.1)',
    sourcelyScore: 79,
    scores: { demand: 82, competition: 68, margin: 78, trend: 85 },
    verdict: 'recommended',
    avgPrice: 38900, estimatedMargin: 38,
    monthlySearchVolume: 19800, competitorCount: 156,
  },
  {
    id: 5, rank: 5, name: '실리콘 주방 매트', category: 'living',
    icon: '🍽️', iconBg: 'rgba(0,229,160,0.1)',
    sourcelyScore: 75,
    scores: { demand: 70, competition: 82, margin: 74, trend: 72 },
    verdict: 'hold',
    avgPrice: 9900, estimatedMargin: 45,
    monthlySearchVolume: 15600, competitorCount: 89,
  },
  {
    id: 6, rank: 6, name: '무선 충전 마우스패드', category: 'electronics',
    icon: '🖱️', iconBg: 'rgba(0,87,255,0.1)',
    sourcelyScore: 71,
    scores: { demand: 68, competition: 65, margin: 72, trend: 78 },
    verdict: 'hold',
    avgPrice: 29900, estimatedMargin: 32,
    monthlySearchVolume: 12300, competitorCount: 245,
  },
  {
    id: 7, rank: 7, name: '비건 립밤 세트', category: 'beauty',
    icon: '💄', iconBg: 'rgba(255,77,109,0.1)',
    sourcelyScore: 68,
    scores: { demand: 62, competition: 58, margin: 75, trend: 74 },
    verdict: 'hold',
    avgPrice: 8900, estimatedMargin: 48,
    monthlySearchVolume: 9800, competitorCount: 178,
  },
  {
    id: 8, rank: 8, name: '캠핑 접이식 테이블', category: 'living',
    icon: '⛺', iconBg: 'rgba(0,229,160,0.1)',
    sourcelyScore: 55,
    scores: { demand: 60, competition: 42, margin: 58, trend: 52 },
    verdict: 'not_recommended',
    avgPrice: 45900, estimatedMargin: 22,
    monthlySearchVolume: 31200, competitorCount: 520,
  },
  {
    id: 9, rank: 9, name: '다이어트 곤약 젤리', category: 'food',
    icon: '🍬', iconBg: 'rgba(255,200,0,0.1)',
    sourcelyScore: 48,
    scores: { demand: 55, competition: 35, margin: 45, trend: 50 },
    verdict: 'not_recommended',
    avgPrice: 12900, estimatedMargin: 18,
    monthlySearchVolume: 42100, competitorCount: 680,
  },
  {
    id: 10, rank: 10, name: '레깅스 요가 팬츠', category: 'fashion',
    icon: '👖', iconBg: 'rgba(0,87,255,0.1)',
    sourcelyScore: 42,
    scores: { demand: 48, competition: 30, margin: 40, trend: 45 },
    verdict: 'not_recommended',
    avgPrice: 19900, estimatedMargin: 15,
    monthlySearchVolume: 58200, competitorCount: 1240,
  },
]

// ── 키워드 분석 ──
export const mockKeywordData = {
  '미니 가습기': {
    primary: {
      keyword: '미니 가습기',
      monthlyVolume: 48200,
      competitorCount: 124,
      avgPrice: 15900,
      competitionLevel: 'medium',
    },
    related: [
      { keyword: 'USB 가습기', volume: 32100 },
      { keyword: '무선 가습기', volume: 28400 },
      { keyword: '차량용 가습기', volume: 19800 },
      { keyword: '미니 가습기 추천', volume: 15200 },
      { keyword: '무드등 가습기', volume: 12600 },
      { keyword: '충전식 가습기', volume: 9800 },
      { keyword: '캡슐 가습기', volume: 7200 },
      { keyword: '사무실 가습기', volume: 6100 },
    ],
    monthlyTrend: [
      { month: '4월', volume: 18200 },
      { month: '5월', volume: 14500 },
      { month: '6월', volume: 12100 },
      { month: '7월', volume: 11800 },
      { month: '8월', volume: 13200 },
      { month: '9월', volume: 22400 },
      { month: '10월', volume: 35600 },
      { month: '11월', volume: 48200 },
      { month: '12월', volume: 52100 },
      { month: '1월', volume: 44300 },
      { month: '2월', volume: 38700 },
      { month: '3월', volume: 28900 },
    ],
  },
  '블루투스 이어폰': {
    primary: {
      keyword: '블루투스 이어폰',
      monthlyVolume: 38100,
      competitorCount: 312,
      avgPrice: 24900,
      competitionLevel: 'high',
    },
    related: [
      { keyword: '넥밴드 이어폰', volume: 22400 },
      { keyword: '무선 이어폰 추천', volume: 18900 },
      { keyword: '가성비 이어폰', volume: 15600 },
      { keyword: '운동용 이어폰', volume: 12100 },
      { keyword: '노이즈캔슬링 이어폰', volume: 9800 },
      { keyword: '오픈형 이어폰', volume: 8400 },
    ],
    monthlyTrend: [
      { month: '4월', volume: 32100 },
      { month: '5월', volume: 30800 },
      { month: '6월', volume: 28900 },
      { month: '7월', volume: 31200 },
      { month: '8월', volume: 33400 },
      { month: '9월', volume: 35100 },
      { month: '10월', volume: 36800 },
      { month: '11월', volume: 42100 },
      { month: '12월', volume: 48900 },
      { month: '1월', volume: 38100 },
      { month: '2월', volume: 35200 },
      { month: '3월', volume: 33800 },
    ],
  },
}

// 기본 키워드 (검색어 없을 때)
export const defaultKeyword = '미니 가습기'

// ── 경쟁 분석 ──
export const mockCompetitionData = {
  '미니 가습기': {
    keyword: '미니 가습기',
    difficulty: {
      overall: 6.5,
      reviewBarrier: '평균 487개',
      estimatedAdCost: 850,
      priceCompetition: 'high',
    },
    priceRange: { min: 8900, max: 45900, avg: 18200 },
    topSellers: [
      { rank: 1, name: '가습기왕', reviewCount: 12840, price: 15900, rating: 4.7, estimatedMonthlyRevenue: 48000000 },
      { rank: 2, name: '미니홈케어', reviewCount: 8920, price: 13900, rating: 4.6, estimatedMonthlyRevenue: 35000000 },
      { rank: 3, name: '에어플러스', reviewCount: 6340, price: 19900, rating: 4.8, estimatedMonthlyRevenue: 28000000 },
      { rank: 4, name: '스마트리빙', reviewCount: 4210, price: 11900, rating: 4.5, estimatedMonthlyRevenue: 22000000 },
      { rank: 5, name: '홈앤라이프', reviewCount: 3890, price: 22900, rating: 4.4, estimatedMonthlyRevenue: 18000000 },
      { rank: 6, name: '디지털허브', reviewCount: 2780, price: 16900, rating: 4.3, estimatedMonthlyRevenue: 15000000 },
      { rank: 7, name: '쿨미스트', reviewCount: 2140, price: 14900, rating: 4.6, estimatedMonthlyRevenue: 12000000 },
      { rank: 8, name: '촉촉한하루', reviewCount: 1560, price: 9900, rating: 4.2, estimatedMonthlyRevenue: 9500000 },
      { rank: 9, name: '에코미스트', reviewCount: 980, price: 25900, rating: 4.7, estimatedMonthlyRevenue: 7200000 },
      { rank: 10, name: '가습닷컴', reviewCount: 620, price: 8900, rating: 4.1, estimatedMonthlyRevenue: 4800000 },
    ],
  },
  '블루투스 이어폰': {
    keyword: '블루투스 이어폰',
    difficulty: {
      overall: 8.2,
      reviewBarrier: '평균 1,240개',
      estimatedAdCost: 1200,
      priceCompetition: 'very_high',
    },
    priceRange: { min: 9900, max: 89900, avg: 32400 },
    topSellers: [
      { rank: 1, name: '사운드피크', reviewCount: 28400, price: 24900, rating: 4.8, estimatedMonthlyRevenue: 92000000 },
      { rank: 2, name: '오디오맥스', reviewCount: 19200, price: 32900, rating: 4.7, estimatedMonthlyRevenue: 78000000 },
      { rank: 3, name: '뮤직프로', reviewCount: 15600, price: 19900, rating: 4.5, estimatedMonthlyRevenue: 65000000 },
      { rank: 4, name: '이어테크', reviewCount: 12100, price: 29900, rating: 4.6, estimatedMonthlyRevenue: 52000000 },
      { rank: 5, name: '사운드웨이브', reviewCount: 8900, price: 15900, rating: 4.4, estimatedMonthlyRevenue: 41000000 },
    ],
  },
}

// ── 마진 계산기 수수료 ──
export const platformFees = {
  coupangRocket: {
    name: '쿠팡 로켓그로스',
    commissionRate: 0.108,
    fulfillmentFee: 3500,
    returnRate: 0.05,
  },
  smartStore: {
    name: '스마트스토어',
    commissionRate: 0.055,
    fulfillmentFee: 0,
    returnRate: 0.03,
  },
}
