# Commerce_AI 프로젝트 구조

## 서비스 개요

**Sourcely** - AI 상품 소싱 판단 보조 서비스

사용자가 키워드를 입력하면, 네이버 쇼핑 데이터를 수집하여 검색 트렌드/경쟁 강도/예상 마진/트렌드를 분석하고, AI가 종합 판정(추천/보류/비추천)과 진입 전략을 제시한다.

## 핵심 흐름

```
[Home] 키워드 입력 → [백엔드] 데이터 수집 + 점수 계산 + AI 분석 → [Result] 결과 표시
```

## 환경 구분

| 환경 | 백엔드 | 설명 |
|------|--------|------|
| 로컬 개발 | `server/` (Express, 포트 3001) | Vite가 `/api` 요청을 프록시 |
| 배포 | `functions/` (Cloudflare Pages Functions) | Hono 라우터, 서버 로직을 단일 파일에 포함 |

---

## 프론트엔드 (`src/`)

### 진입점과 라우팅

| 파일 | 역할 |
|------|------|
| `main.jsx` | React 앱 진입점 (DOM 렌더링) |
| `App.jsx` | 라우팅 설정. `/` → Home, `/result` → Result, `/analysis` 등 → 디자인 시안 iframe |
| `App.css` | 디자인 시안 전환 버튼 스타일 |

### 페이지 (`src/pages/`)

| 파일 | 역할 |
|------|------|
| `Home.jsx` / `.css` | 홈 화면. 키워드 입력 + 카테고리 선택 → `/result`로 이동 |
| `Result.jsx` / `.css` | 결과 화면. `POST /api/ai/analyze` 호출 → Sourcely 점수, 세부 점수 바, 데이터 카드, 플랫폼별 마진, AI 분석(결론/추천이유/리스크/전략) 표시 |

### API 클라이언트 (`src/api/`)

| 파일 | 역할 | 현재 사용 여부 |
|------|------|--------------|
| `client.js` | `fetch` 래퍼 (`get`, `post` 함수) | 모든 API 호출의 기반 |
| `ai.js` | `POST /api/ai/analyze` 호출 | Result 페이지에서 사용 |
| `keywords.js` | 키워드 검색/트렌딩 API 호출 | 프론트에서 직접 사용 안 함 (백엔드에서 내부 처리) |
| `competition.js` | 경쟁 분석 API 호출 | 위와 동일 |
| `products.js` | 상품 분석 API 호출 | 위와 동일 |
| `ranking.js` | 랭킹 추적 API 호출 | 위와 동일 |
| `sourcing.js` | 소싱 검색 API 호출 | 위와 동일 |

> keywords~sourcing API 클라이언트는 현재 프론트엔드에서 직접 호출하지 않지만, 백엔드 API 엔드포인트는 존재하므로 향후 확장 시 사용 가능.

### 컴포넌트 (`src/components/`)

**keyword/** - 키워드 분석 UI 컴포넌트

| 파일 | 역할 |
|------|------|
| `KeywordTable.jsx` / `.css` | 키워드 검색 결과 테이블 |
| `KeywordVerdict.jsx` / `.css` | 키워드 판정 결과 표시 |
| `KeywordMarginCard.jsx` / `.css` | 키워드별 마진 카드 |
| `TrendChart.jsx` / `.css` | 검색 트렌드 차트 |
| `TrendingKeywordTable.jsx` / `.css` | 트렌딩 키워드 목록 테이블 |
| `RelatedKeywords.jsx` / `.css` | 연관 키워드 목록 |

**shared/** - 공통 UI 컴포넌트

| 파일 | 역할 |
|------|------|
| `ScoreRing.jsx` / `.css` | 원형 점수 표시 (0~100) |
| `ScoreBar.jsx` / `.css` | 막대형 점수 표시 |
| `StatCard.jsx` / `.css` | 통계 카드 (숫자 + 라벨) |
| `DataTable.jsx` / `.css` | 데이터 테이블 공통 |
| `InputField.jsx` / `.css` | 입력 필드 공통 |
| `StatusStates.jsx` / `.css` | 로딩/에러/빈 상태 표시 |

### 기타

| 파일 | 역할 |
|------|------|
| `data/mockData.js` | 카테고리 목록 (Home에서 사용) |
| `styles/global.css` | 전체 앱 공통 스타일 (폰트, 리셋 등) |

---

## 백엔드 - 로컬 개발용 (`server/`)

### 진입점

| 파일 | 역할 |
|------|------|
| `server.js` | Express 서버 시작 (포트 3001) |
| `app.js` | 미들웨어(cors, json) 설정, 라우트 등록, 트렌딩 캐시 스케줄러 |

### API 라우트 (`server/src/routes/`)

| 파일 | 엔드포인트 | 역할 |
|------|-----------|------|
| `ai.js` | `POST /api/ai/analyze` | 키워드 데이터 수집 → 점수 계산 → AI 분석 → 종합 결과 반환 |
| `keywords.js` | `GET /api/keywords/search`, `GET /api/keywords/trending` | 키워드 검색, 트렌딩 키워드 |
| `competition.js` | `GET /api/competition/:keyword` | 경쟁 분석 (난이도, 상위 셀러, 가격대) |
| `products.js` | `POST /api/products/analyze`, `GET /api/products/trending` 등 | 상품 분석, 트렌딩 상품 |
| `sourcing.js` | `GET /api/sourcing/estimate`, `POST /api/sourcing/search` | 소싱가 추정, 1688/알리 검색 링크 |
| `ranking.js` | `POST /api/ranking/check`, `POST /api/ranking/check-multi` | 네이버 쇼핑 내 스토어 랭킹 추적 |

### 어댑터 (`server/src/adapters/`) - 외부 API 연동

| 파일 | 역할 |
|------|------|
| `base/SalesPlatformAdapter.js` | 판매 플랫폼 어댑터 추상 클래스 |
| `base/SourcingPlatformAdapter.js` | 소싱 플랫폼 어댑터 추상 클래스 |
| `sales/NaverAdapter.js` | 네이버 쇼핑 API, 데이터랩 API, 검색광고 API 연동 |
| `sales/CoupangAdapter.js` | 쿠팡 수수료 정보 제공 (실제 API 미연동, 수수료 데이터만) |
| `sourcing/Ali1688Adapter.js` | 1688 소싱가를 카테고리별 비율로 추정 |

### 서비스 (`server/src/services/`) - 비즈니스 로직

| 파일 | 역할 |
|------|------|
| `scoringEngine.js` | Sourcely 점수 계산 (수요 25% + 경쟁 25% + 마진 30% + 트렌드 20%) |
| `aiAnalysis.js` | GPT-4o-mini에 프롬프트를 보내 AI 분석 텍스트 생성 |
| `profitCalculator.js` | 플랫폼별 수수료 적용하여 순이익/마진율 계산 |
| `trendingService.js` | 트렌딩 키워드 캐시 관리 (6시간 주기 갱신) |

### 유틸/데이터

| 파일 | 역할 |
|------|------|
| `utils/platformRegistry.js` | 판매/소싱 어댑터 인스턴스를 생성하고 관리 |
| `data/seedKeywords.js` | 트렌딩 분석용 기본 키워드 목록 (8개 카테고리 50+개) |

---

## 백엔드 - 배포용 (`functions/`)

Cloudflare Pages Functions. 로컬 서버의 로직을 Cloudflare Workers 환경에 맞게 재구성한 것.

| 파일 | 역할 |
|------|------|
| `api/[[route]].js` | 모든 `/api/*` 요청을 Hono 라우터로 처리. 점수 계산 함수가 인라인으로 포함됨 |
| `_shared/adapters.js` | 네이버/쿠팡/1688 어댑터를 Workers 환경용으로 생성 |
| `_shared/ai.js` | OpenAI API를 fetch로 직접 호출하여 AI 분석 생성 |
| `_shared/platformRegistry.js` | 판매/소싱 플랫폼 어댑터 관리 |

---

## 디자인 시안 (`design/`)

향후 구현할 페이지의 HTML 디자인 시안. App.jsx에서 iframe으로 미리볼 수 있음.

| 파일 | 페이지 |
|------|--------|
| `analysis.html` | 상품 분석 |
| `noti.html` | 알림 센터 |
| `setting.html` | 설정 |
| `subscription.html` | 이용권 안내 |
| `support.html` | 문의하기 |

---

## 설정 파일

| 파일 | 역할 |
|------|------|
| `index.html` | Vite 앱 HTML 진입점 |
| `package.json` | 프론트엔드 의존성 및 빌드 스크립트 |
| `vite.config.js` | Vite 설정 (React 플러그인, `/api` → localhost:3001 프록시) |
| `public/_redirects` | Cloudflare Pages SPA 라우팅 (`/* → /index.html`) |
| `server/.env` | 서버 환경 변수 (네이버 API 키, OpenAI 키 등) |
