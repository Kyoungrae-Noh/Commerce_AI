import { Router } from 'express'
import { getSalesAdapter } from '../utils/platformRegistry.js'

const router = Router()

// GET /api/competition/:keyword
router.get('/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params
    if (!keyword) return res.status(400).json({ error: '키워드를 입력하세요' })

    const naver = getSalesAdapter('naver')
    const data = await naver.getCompetition(keyword)

    res.json(data)
  } catch (err) {
    console.error('Competition error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
