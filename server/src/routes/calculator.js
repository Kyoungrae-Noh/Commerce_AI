import { Router } from 'express'
import { calcPlatformProfit, compareAllPlatforms } from '../services/profitCalculator.js'
import { getAllPlatformFees } from '../utils/platformRegistry.js'

const router = Router()

// POST /api/calculator/profit
router.post('/profit', (req, res) => {
  try {
    const { sourcingCost, intlShipping, domesticShipping, sellingPrice, adCost, platform } = req.body

    const values = {
      sourcingCost: Number(sourcingCost) || 0,
      intlShipping: Number(intlShipping) || 0,
      domesticShipping: Number(domesticShipping) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      adCost: Number(adCost) || 0,
    }

    if (platform === 'compare' || !platform) {
      res.json({ mode: 'compare', results: compareAllPlatforms(values) })
    } else {
      const fees = getAllPlatformFees()
      const fee = fees[platform]
      if (!fee) return res.status(400).json({ error: `Unknown platform: ${platform}` })
      res.json({ mode: 'single', platform, result: calcPlatformProfit(values, fee) })
    }
  } catch (err) {
    console.error('Calculator error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/calculator/fees
router.get('/fees', (req, res) => {
  res.json(getAllPlatformFees())
})

export default router
