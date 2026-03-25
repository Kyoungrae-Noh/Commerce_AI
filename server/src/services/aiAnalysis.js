import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateAnalysis({ keyword, scoring, keywordData, competitionData, sourcingCost, marginByPlatform }) {
  const prompt = `당신은 한국 이커머스(쿠팡/네이버 스마트스토어) 상품 소싱 전문 분석가입니다.
다음 데이터를 기반으로 이 키워드의 상품 진입 가능성을 분석해주세요.

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
{
  "conclusion": "2-3문장의 종합 결론. 이 상품을 소싱할지 말지에 대한 명확한 판단을 포함.",
  "reasons": ["판단의 근거가 되는 이유 3가지. 각각 한 문장으로."],
  "risks": ["주의해야 할 리스크 2-3가지. 각각 한 문장으로."],
  "entryStrategy": "이 상품에 진입한다면 어떤 전략이 좋을지 2-3문장으로 제안."
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0].message.content)
}
