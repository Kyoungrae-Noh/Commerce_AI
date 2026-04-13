function buildJsonSchema(score) {
  if (score >= 70) {
    return `{
  "conclusion": "키워드명과 핵심 숫자(검색량, 경쟁상품수, 성장률)를 직접 인용하며 2-3문장으로 현황 서술.",
  "reasons": ["데이터 숫자를 근거로 긍정적 사실 3가지. 각각 한 문장. 예: '${'{keyword}'}의 월간 검색량 ${'{N}'}회는 ... 수준이다'"],
  "risks": ["데이터 숫자를 근거로 주의할 사실 2-3가지. 각각 한 문장."],
  "entryStrategy": "이 키워드의 데이터 특성에 맞는 구체적 진입 전략 2-3문장."
}`
  }
  if (score >= 40) {
    return `{
  "conclusion": "키워드명과 핵심 숫자(검색량, 경쟁상품수, 성장률)를 직접 인용하며 2-3문장으로 현황 서술.",
  "positives": ["데이터 숫자를 근거로 긍정적 사실 2-3가지. 각각 한 문장."],
  "risks": ["데이터 숫자를 근거로 주의할 사실 2-3가지. 각각 한 문장."],
  "entryStrategy": "이 키워드의 데이터 특성에 맞는 구체적 진입 전략 2-3문장."
}`
  }
  return `{
  "conclusion": "키워드명과 핵심 숫자(검색량, 경쟁상품수, 성장률)를 직접 인용하며 2-3문장으로 현황 서술.",
  "risks": ["데이터 숫자를 근거로 진입이 어려운 핵심 사실 3-4가지. 각각 한 문장."],
  "ifEntry": "이 키워드의 데이터 특성에 맞는 구체적 우회 전략 2-3문장."
}`
}

export async function generateAnalysis(env, { keyword, scoring, keywordData, competitionData }) {
  const ratio = keywordData.monthlyVolume
    ? Math.round((keywordData.competitorCount / keywordData.monthlyVolume) * 10) / 10
    : null
  const jsonSchema = buildJsonSchema(scoring.sourcelyScore)

  const prompt = `당신은 한국 이커머스 상품 소싱 데이터 분석기입니다.
아래 "${keyword}" 키워드의 실제 데이터를 분석하세요.

작성 원칙:
1. 반드시 "${keyword}"라는 키워드명을 분석 문장에 직접 포함하세요.
2. 월간 검색량, 경쟁 상품 수, 경쟁비율, 성장률 등 실제 숫자를 문장에 인용하세요. 예: "머그컵의 월간 검색량 24,090회는 중간 수준이며..."
3. 판단이 아닌 데이터 사실을 서술하세요. "좋다/나쁘다" 대신 "~이다", "~에 해당한다" 형태로 작성하세요.
4. 마진/소싱가/수익성 관련 언급은 하지 마세요.
5. 이 키워드만의 고유한 특성(카테고리, 계절성, 타겟층 등)을 반영하세요.

데이터:
- 키워드: ${keyword}
- 종합 점수: ${scoring.sourcelyScore}/100
- 월간 검색량: ${keywordData.monthlyVolume?.toLocaleString() || '데이터 없음'}회 (수요 점수 ${scoring.scores.demand}/100)
- 경쟁 상품 수: ${keywordData.competitorCount?.toLocaleString()}개
- 경쟁 비율: 검색 1회당 경쟁 상품 ${ratio ?? 'N/A'}개 (경쟁강도 점수 ${scoring.scores.competition}/100, 높을수록 치열)
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
      temperature: 0.5,
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
