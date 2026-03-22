import express from 'express'
import cors from 'cors'
import keywordsRouter from './routes/keywords.js'
import competitionRouter from './routes/competition.js'
import calculatorRouter from './routes/calculator.js'
import productsRouter from './routes/products.js'
import sourcingRouter from './routes/sourcing.js'
import rankingRouter from './routes/ranking.js'
import { refreshTrendingCache, isCacheStale } from './services/trendingService.js'

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/keywords', keywordsRouter)
app.use('/api/competition', competitionRouter)
app.use('/api/calculator', calculatorRouter)
app.use('/api/products', productsRouter)
app.use('/api/sourcing', sourcingRouter)
app.use('/api/ranking', rankingRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 서버 시작 후 트렌딩 캐시 자동 갱신
setTimeout(() => {
  console.log('[Startup] 트렌딩 캐시 초기 갱신 시작...')
  refreshTrendingCache()
}, 3000)

// 6시간마다 캐시 만료 체크
setInterval(() => {
  if (isCacheStale()) {
    console.log('[Scheduler] 캐시 만료, 갱신 시작...')
    refreshTrendingCache()
  }
}, 6 * 60 * 60 * 1000)

export default app
