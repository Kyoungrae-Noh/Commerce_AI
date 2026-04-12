function buildJsonSchema(score) {
  if (score >= 70) {
    return `{
  "conclusion": "2-3문장의 종합 의견. 확정적 판단 대신 '~할 수 있습니다' 형태로 작성. 추정값 포함 안내 필수.",
  "reasons": ["추천할 수 있는 이유 3가지. 각각 한 문장으로."],
  "risks": ["그래도 주의가 필요한 리스크 2-3가지. 각각 한 문장으로."],
  "entryStrategy": "효과적인 진입 전략 2-3문장. 신중한 표현 사용."
}`
  }
  if (score >= 40) {
    return `{
  "conclusion": "2-3문장의 종합 의견. 확정적 판단 대신 '~할 수 있습니다' 형태로 작성. 추정값 포함 안내 필수.",
  "positives": ["긍정적으로 볼 수 있는 요소 2-3가지. 각각 한 문장으로."],
  "risks": ["주의가 필요한 리스크 2-3가지. 각각 한 문장으로."],
  "entryStrategy": "진입을 검토한다면 고려해볼 수 있는 전략 2-3문장. 신중한 표현 사용."
}`
  }
  return `{
  "conclusion": "2-3문장의 종합 의견. 확정적 판단 대신 '~할 수 있습니다' 형태로 작성. 추정값 포함 안내 필수.",
  "risks": ["진입이 어려운 핵심 리스크 3-4가지. 각각 한 문장으로."],
  "ifEntry": "그럼에도 진입한다면 고려해야 할 전략 2-3문장. 신중한 표현 사용."
}`
}

export async function generateAnalysis(env, { keyword, scoring, keywordData, competitionData, sourcingCost, marginByPlatform }) {
  const jsonSchema = buildJsonSchema(scoring.sourcelyScore)

  const prompt = `당신은 한국 이커머스(쿠팡/네이버 스마트스토어) 상품 소싱 분석 보조 도구입니다.
다음 데이터를 기반으로 이 키워드의 상품 진입 가능성을 분석해주세요.

중요 주의사항:
- 소싱가는 판매가의 약 30%로 추정한 값이므로 마진 관련 수치는 참고용입니다.
- 월간 검색량이 없는 경우 수요 판단은 제한적입니다.
- "~해야 합니다", "~하세요" 같은 확정적/지시적 표현 대신 "~할 수 있습니다", "~를 고려해볼 수 있습니다" 같은 신중한 표현을 사용하세요.
- 결론에 "일부 지표는 추정값이 포함되어 있으므로 실제 소싱가 확인 후 최종 판단을 권장합니다"를 반드시 포함하세요.

키워드: ${keyword}
Sourcely Score: ${scoring.sourcelyScore}/100 (판정: ${scoring.verdict})
세부 점수: 수요 ${scoring.scores.demand}/100, 경쟁 ${scoring.scores.competition}/100, 마진 ${scoring.scores.margin}/100, 트렌드 ${scoring.scores.trend}/100

월간 검색량: ${keywordData.monthlyVolume || '추정 불가'}
경쟁 상품 수: ${keywordData.competitorCount}개
평균 판매가: ${keywordData.avgPrice?.toLocaleString()}원
경쟁 난이도: ${competitionData.difficulty?.overall || 'N/A'}/10
예상 소싱가: ${sourcingCost.estimatedPrice?.toLocaleString()}원
예상 국제배송비: ${sourcingCost.shippingEstimate?.toLocaleString()}원

플랫폼별 예상 마진:
${Object.entries(marginByPlatform).map(([name, m]) => `- ${name}: 순이익 ${m.netProfit?.toLocaleString()}원 (마진율 ${m.marginRate}%)`).join('\n')}

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
      temperature: 0.7,
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
