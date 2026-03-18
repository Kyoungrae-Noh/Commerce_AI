import express from 'express'
import cors from 'cors'
import keywordsRouter from './routes/keywords.js'
import competitionRouter from './routes/competition.js'
import calculatorRouter from './routes/calculator.js'
import productsRouter from './routes/products.js'
import sourcingRouter from './routes/sourcing.js'

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/keywords', keywordsRouter)
app.use('/api/competition', competitionRouter)
app.use('/api/calculator', calculatorRouter)
app.use('/api/products', productsRouter)
app.use('/api/sourcing', sourcingRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app
