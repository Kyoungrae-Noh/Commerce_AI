import { useState, useEffect, useRef } from "react";

const SAMPLE_DATA = {
  텀블러: { searchVolume: 85000, competitorCount: 4200, avgPrice: 18000, reviewBarrier: "높음" },
  "차량용 청소기": { searchVolume: 32000, competitorCount: 890, avgPrice: 45000, reviewBarrier: "중간" },
  "강아지 계단": { searchVolume: 18000, competitorCount: 320, avgPrice: 28000, reviewBarrier: "낮음" },
  "캠핑 의자": { searchVolume: 62000, competitorCount: 2800, avgPrice: 35000, reviewBarrier: "높음" },
  "무선 충전기": { searchVolume: 94000, competitorCount: 6100, avgPrice: 22000, reviewBarrier: "높음" },
  "요가 매트": { searchVolume: 41000, competitorCount: 1200, avgPrice: 25000, reviewBarrier: "중간" },
};

async function analyzeKeyword(keyword) {
  const data = SAMPLE_DATA[keyword] || {
    searchVolume: Math.floor(Math.random() * 80000) + 5000,
    competitorCount: Math.floor(Math.random() * 3000) + 100,
    avgPrice: Math.floor(Math.random() * 60000) + 8000,
    reviewBarrier: ["낮음", "중간", "높음"][Math.floor(Math.random() * 3)],
  };

  const prompt = `당신은 한국 이커머스(쿠팡, 스마트스토어) 상품 소싱 전문 AI 분석가입니다.

다음 데이터를 바탕으로 초보 셀러를 위한 상품 소싱 분석을 제공하세요.

상품 키워드: ${keyword}
월간 검색량: ${data.searchVolume.toLocaleString()}
경쟁 상품 수: ${data.competitorCount.toLocaleString()}
평균 판매가: ${data.avgPrice.toLocaleString()}원
리뷰 장벽: ${data.reviewBarrier}

아래 JSON 형식으로만 응답하세요. 다른 텍스트나 마크다운은 절대 포함하지 마세요:

{
  "demandScore": 수요점수(0-100),
  "competitionScore": 경쟁도점수(0-100, 낮을수록 좋음),
  "marginScore": 마진가능성점수(0-100),
  "totalScore": 종합추천점수(0-100),
  "recommendation": "추천" 또는 "보통" 또는 "비추천",
  "reasons": ["추천 이유 1", "추천 이유 2", "추천 이유 3"],
  "risks": ["주의사항 1", "주의사항 2"],
  "targetSeller": "이 상품이 맞는 셀러 유형 한 문장",
  "alternatives": ["대체 아이템1", "대체 아이템2", "대체 아이템3", "대체 아이템4", "대체 아이템5"],
  "aiComment": "AI의 핵심 한 줄 코멘트 (구체적이고 실질적으로)"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const result = await response.json();
  const text = result.content[0].text.replace(/```json|```/g, "").trim();
  const analysis = JSON.parse(text);
  return { ...analysis, rawData: data };
}

function ScoreRing({ score, label, color, size = 80 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a1a2e" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text
          x={size / 2}
          y={size / 2 + 5}
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="700"
          style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}
        >
          {score}
        </text>
      </svg>
      <span style={{ fontSize: "11px", color: "#888", letterSpacing: "0.05em" }}>{label}</span>
    </div>
  );
}

function AnimatedNumber({ value, duration = 1500 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{display}</span>;
}

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  const handleAnalyze = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await analyzeKeyword(keyword.trim());
      setResult({ keyword: keyword.trim(), ...analysis });
      setHistory(prev => [{ keyword: keyword.trim(), score: analysis.totalScore, rec: analysis.recommendation }, ...prev.slice(0, 4)]);
    } catch (e) {
      setError("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
    setLoading(false);
  };

  const recColor = result?.recommendation === "추천" ? "#00ff88" : result?.recommendation === "보통" ? "#ffd700" : "#ff4466";
  const recBg = result?.recommendation === "추천" ? "rgba(0,255,136,0.08)" : result?.recommendation === "보통" ? "rgba(255,215,0,0.08)" : "rgba(255,68,102,0.08)";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080812",
      color: "white",
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      padding: "0",
    }}>
      {/* 배경 효과 */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(0,100,255,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(120,0,255,0.06) 0%, transparent 60%)",
        pointerEvents: "none"
      }} />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 20px", position: "relative", zIndex: 1 }}>

        {/* 헤더 */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "linear-gradient(135deg, #0066ff, #7700ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px"
            }}>⚡</div>
            <span style={{ fontSize: "13px", color: "#0066ff", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              SourcingAI
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "800", lineHeight: 1.2, margin: "0 0 12px" }}>
            어떤 상품을 팔아야 할지<br />
            <span style={{ background: "linear-gradient(90deg, #0066ff, #7700ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI가 대신 분석해드립니다
            </span>
          </h1>
          <p style={{ fontSize: "14px", color: "#666", margin: 0, lineHeight: 1.6 }}>
            검색량 · 경쟁도 · 마진 가능성을 종합해 초보 셀러의 실패 확률을 줄여드립니다
          </p>
        </div>

        {/* 검색 */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            display: "flex", gap: "12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "16px", padding: "8px 8px 8px 20px",
            transition: "border-color 0.2s",
          }}>
            <input
              ref={inputRef}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAnalyze()}
              placeholder="상품 키워드 입력  예: 텀블러, 차량용 청소기, 강아지 계단"
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "white", fontSize: "15px", padding: "8px 0",
              }}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !keyword.trim()}
              style={{
                padding: "12px 28px",
                background: loading ? "rgba(0,102,255,0.3)" : "linear-gradient(135deg, #0066ff, #7700ff)",
                border: "none", borderRadius: "10px",
                color: "white", fontWeight: "700", fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.02em", whiteSpace: "nowrap",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "분석 중..." : "AI 분석"}
            </button>
          </div>

          {/* 추천 키워드 */}
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            {Object.keys(SAMPLE_DATA).map(k => (
              <button key={k} onClick={() => setKeyword(k)}
                style={{
                  padding: "5px 12px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px",
                  color: "#aaa", fontSize: "12px", cursor: "pointer",
                }}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* 로딩 */}
        {loading && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "rgba(255,255,255,0.02)", borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              border: "3px solid rgba(0,102,255,0.2)",
              borderTopColor: "#0066ff",
              margin: "0 auto 20px",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
              검색량, 경쟁도, 마진 가능성 분석 중...
            </p>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div style={{
            padding: "16px 20px", background: "rgba(255,68,102,0.08)",
            border: "1px solid rgba(255,68,102,0.2)", borderRadius: "12px",
            color: "#ff4466", fontSize: "14px",
          }}>{error}</div>
        )}

        {/* 결과 */}
        {result && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* 종합 카드 */}
            <div style={{
              background: recBg,
              border: `1px solid ${recColor}33`,
              borderRadius: "20px", padding: "28px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px", letterSpacing: "0.08em" }}>분석 키워드</div>
                  <h2 style={{ margin: "0 0 12px", fontSize: "24px", fontWeight: "800" }}>"{result.keyword}"</h2>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    background: `${recColor}22`, border: `1px solid ${recColor}44`,
                    borderRadius: "8px", padding: "6px 14px",
                  }}>
                    <span style={{ color: recColor, fontSize: "18px" }}>
                      {result.recommendation === "추천" ? "✓" : result.recommendation === "보통" ? "△" : "✕"}
                    </span>
                    <span style={{ color: recColor, fontWeight: "700", fontSize: "15px" }}>
                      {result.recommendation}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>종합 추천 점수</div>
                  <div style={{ fontSize: "56px", fontWeight: "900", lineHeight: 1, color: recColor }}>
                    <AnimatedNumber value={result.totalScore} />
                  </div>
                  <div style={{ fontSize: "14px", color: "#555" }}>/ 100</div>
                </div>
              </div>

              <div style={{
                marginTop: "20px", padding: "14px 18px",
                background: "rgba(0,0,0,0.3)", borderRadius: "10px",
                fontSize: "14px", color: "#ccc", lineHeight: 1.6,
                borderLeft: `3px solid ${recColor}`,
              }}>
                💬 {result.aiComment}
              </div>
            </div>

            {/* 점수 세부 */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "20px", padding: "24px",
            }}>
              <h3 style={{ margin: "0 0 20px", fontSize: "13px", color: "#666", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                세부 점수
              </h3>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "16px" }}>
                <ScoreRing score={result.demandScore} label="수요" color="#0099ff" />
                <ScoreRing score={100 - result.competitionScore} label="경쟁 여유" color="#ff6600" />
                <ScoreRing score={result.marginScore} label="마진 가능성" color="#00cc66" />
              </div>

              {/* 원시 데이터 */}
              <div style={{
                marginTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}>
                {[
                  { label: "월간 검색량", value: result.rawData.searchVolume.toLocaleString() },
                  { label: "경쟁 상품 수", value: result.rawData.competitorCount.toLocaleString() },
                  { label: "평균 판매가", value: result.rawData.avgPrice.toLocaleString() + "원" },
                  { label: "리뷰 장벽", value: result.rawData.reviewBarrier },
                ].map(item => (
                  <div key={item.label} style={{
                    background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px 16px",
                  }}>
                    <div style={{ fontSize: "11px", color: "#555", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#ddd" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 추천 이유 / 위험 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{
                background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)",
                borderRadius: "16px", padding: "20px",
              }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "12px", color: "#00ff88", letterSpacing: "0.08em" }}>✓ 긍정 요인</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.reasons.map((r, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#bbb", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#00ff88" }}>·</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{
                background: "rgba(255,68,102,0.04)", border: "1px solid rgba(255,68,102,0.12)",
                borderRadius: "16px", padding: "20px",
              }}>
                <h3 style={{ margin: "0 0 14px", fontSize: "12px", color: "#ff4466", letterSpacing: "0.08em" }}>⚠ 주의사항</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.risks.map((r, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#bbb", lineHeight: 1.5, paddingLeft: "14px", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "#ff4466" }}>·</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 타겟 셀러 */}
            <div style={{
              background: "rgba(0,102,255,0.06)", border: "1px solid rgba(0,102,255,0.15)",
              borderRadius: "14px", padding: "16px 20px",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <span style={{ fontSize: "20px" }}>👤</span>
              <div>
                <div style={{ fontSize: "11px", color: "#0066ff", marginBottom: "4px", fontWeight: "600" }}>추천 셀러 유형</div>
                <div style={{ fontSize: "14px", color: "#ccc" }}>{result.targetSeller}</div>
              </div>
            </div>

            {/* 대체 아이템 */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", padding: "20px",
            }}>
              <h3 style={{ margin: "0 0 14px", fontSize: "12px", color: "#666", letterSpacing: "0.08em" }}>🔄 비슷한 대체 아이템</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {result.alternatives.map((alt, i) => (
                  <button key={i} onClick={() => setKeyword(alt)}
                    style={{
                      padding: "7px 14px", background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px",
                      color: "#ccc", fontSize: "13px", cursor: "pointer",
                    }}>
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 분석 히스토리 */}
        {history.length > 0 && (
          <div style={{ marginTop: "32px" }}>
            <h3 style={{ fontSize: "12px", color: "#444", marginBottom: "12px", letterSpacing: "0.08em" }}>최근 분석</h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {history.map((h, i) => (
                <button key={i} onClick={() => setKeyword(h.keyword)}
                  style={{
                    padding: "7px 14px", background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px",
                    color: "#666", fontSize: "12px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}>
                  <span>{h.keyword}</span>
                  <span style={{
                    color: h.rec === "추천" ? "#00ff88" : h.rec === "보통" ? "#ffd700" : "#ff4466",
                    fontWeight: "700",
                  }}>{h.score}점</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 하단 */}
        <div style={{ marginTop: "60px", textAlign: "center", color: "#333", fontSize: "12px" }}>
          AI 분석 결과는 참고용이며 실제 판매 성과를 보장하지 않습니다
        </div>
      </div>
    </div>
  );
}
