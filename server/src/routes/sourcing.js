import { Router } from 'express'
import { getSourcingAdapter } from '../utils/platformRegistry.js'

const router = Router()

// GET /api/sourcing/estimate?q=키워드&avgPrice=15900&category=living
router.get('/estimate', async (req, res) => {
  try {
    const { q, avgPrice, category } = req.query
    if (!q) return res.status(400).json({ error: '키워드를 입력하세요' })

    const adapter = getSourcingAdapter('ali1688')
    const data = await adapter.getEstimatedCost(q, {
      avgSellingPrice: Number(avgPrice) || 15000,
      category: category || 'default',
    })

    res.json(data)
  } catch (err) {
    console.error('Sourcing error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
