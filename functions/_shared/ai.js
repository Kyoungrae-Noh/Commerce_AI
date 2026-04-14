function buildJsonSchema(score) {
  if (score >= 70) {
    return `{
  "conclusion": "키워드명과 핵심 숫자(검색량, 경쟁상품수)를 직접 인용하며 2-3문장으로 현황을 서술합니다.",
  "reasons": ["데이터 숫자를 근거로 긍정적 사실 3가지. 각각 한 문장. 예: '${'{keyword}'}의 월간 검색량 ${'{N}'}회는 ... 수준입니다'"],
  "risks": ["데이터 숫자를 근거로 주의할 사실 2-3가지. 각각 한 문장."],
  "entryStrategy": "아래 '진입 전략 작성 규칙'을 따라 2-3문장으로 작성합니다."
}`
  }
  if (score >= 50) {
    return `{
  "conclusion": "키워드명과 핵심 숫자(검색량, 경쟁상품수)를 직접 인용하며 2-3문장으로 현황을 서술합니다.",
  "positives": ["데이터 숫자를 근거로 긍정적 사실 2-3가지. 각각 한 문장."],
  "risks": ["데이터 숫자를 근거로 주의할 사실 2-3가지. 각각 한 문장."],
  "entryStrategy": "아래 '진입 전략 작성 규칙'을 따라 2-3문장으로 작성합니다."
}`
  }
  return `{
  "conclusion": "키워드명과 핵심 숫자(검색량, 경쟁상품수)를 직접 인용하며 2-3문장으로 현황을 서술합니다.",
  "risks": ["데이터 숫자를 근거로 진입이 어려운 핵심 사실 3-4가지. 각각 한 문장."],
  "ifEntry": "아래 '진입 전략 작성 규칙'을 따라 2-3문장으로 작성합니다."
}`
}

export async function generateAnalysis(env, { keyword, scoring, category, competitionRatio, keywordData, competitionData }) {
  const jsonSchema = buildJsonSchema(scoring.sourcelyScore)

  const prompt = `당신은 한국 이커머스 상품 소싱 데이터 분석기입니다.
아래 "${keyword}" 키워드의 실제 데이터를 분석하세요.

작성 원칙:
1. 반드시 "${keyword}"라는 키워드명을 분석 문장에 직접 포함하세요.
2. 월간 검색량, 경쟁 상품 수, 성장률 등 실제 숫자를 문장에 인용하세요. 예: "머그컵의 월간 검색량 24,090회는 중간 수준입니다."
3. 판단이 아닌 데이터 사실을 서술하세요. "좋다/나쁘다" 대신 "~입니다", "~에 해당합니다" 형태로 작성하세요.
4. 마진/소싱가/수익성 관련 언급은 하지 마세요.
5. 이 키워드만의 고유한 특성(카테고리, 계절성, 타겟층 등)을 반영하세요.
6. 모든 문장은 ~습니다 체로 통일하세요.

진입 전략 작성 규칙:
반드시 아래 조건을 조합하여 이 키워드에만 해당하는 구체적 전략을 2-3문장으로 작성하세요.
'차별화', '마케팅 강화', '소비자 리뷰', '브랜드 인지도' 같은 추상적 표현은 절대 사용하지 마세요.

[경쟁강도 점수 기준]
- 80 이상: 광범위 키워드 직접 진입은 불리합니다. 구체적인 롱테일 키워드 예시 2개를 제시하세요. (예: '머그컵' → '북유럽 감성 머그컵', '커플 머그컵 선물세트')
- 50~79: 상위 노출 경쟁이 가능한 수준입니다. 가격대나 특정 속성으로 포지셔닝 전략을 제시하세요.
- 50 미만: 경쟁이 적어 선점 기회입니다. 빠른 진입과 리뷰 축적 전략을 제시하세요.

[트렌드 점수 기준]
- 65 이상: 수요가 증가 중입니다. 지금 바로 진입해야 하는 타이밍 이유를 구체적으로 제시하세요.
- 35~64: 수요가 안정적입니다. 꾸준한 운영이 가능함을 제시하세요.
- 35 미만: 수요 감소 이유를 카테고리 특성으로 분석하고 진입 여부를 신중히 판단하도록 안내하세요.

[카테고리별 추가 전략]
- electronics: 번들 구성(본품+액세서리), 호환성 강조 전략을 반영하세요.
- fashion: 시즌/트렌드 사이클을 반영한 진입 타이밍을 제시하세요.
- beauty: 용량/성분 차별화, 소용량 테스트 판매 전략을 반영하세요.
- living: 세트 구성, 인테리어 컨셉 포지셔닝 전략을 반영하세요.
- pet: 반려동물 크기/종류별 타겟팅 전략을 반영하세요.
- food: 유통기한 고려한 소량 테스트, 시즌 상품 기획을 반영하세요.

데이터:
- 키워드: ${keyword}
- 카테고리: ${category || '일반'}
- 종합 점수: ${scoring.sourcelyScore}/100
- 월간 검색량: ${keywordData.monthlyVolume?.toLocaleString() || '데이터 없음'}회 (수요 점수 ${scoring.scores.demand}/100)
- 경쟁 상품 수: ${keywordData.competitorCount?.toLocaleString()}개 (경쟁강도 점수 ${scoring.scores.competition}/100, 높을수록 치열)
- 트렌드: 최근 3개월 성장률 기준 트렌드 점수 ${scoring.scores.trend}/100 (50=유지, 65+=상승, 35-=하락)
- 평균 판매가: ${keywordData.avgPrice?.toLocaleString()}원

다음 JSON 형식으로만 답변하세요:
${jsonSchema}`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return JSON.parse(data.choices[0].message.content)
}
