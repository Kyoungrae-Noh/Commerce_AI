import { getAllPlatformFees } from '../utils/platformRegistry.js'

/**
 * 단일 플랫폼 마진 계산
 */
export function calcPlatformProfit(values, platformFee) {
  const commission = Math.round(values.sellingPrice * platformFee.commissionRate)
  const totalCost =
    values.sourcingCost +
    values.intlShipping +
    values.domesticShipping +
    values.adCost +
    commission +
    platformFee.fulfillmentFee

  const netProfit = values.sellingPrice - totalCost
  const marginRate = values.sellingPrice > 0
    ? Math.round((netProfit / values.sellingPrice) * 1000) / 10
    : 0

  return {
    commission,
    fulfillmentFee: platformFee.fulfillmentFee,
    totalCost,
    netProfit,
    marginRate,
  }
}

/**
 * 전체 플랫폼 비교 계산
 */
export function compareAllPlatforms(values) {
  const fees = getAllPlatformFees()
  const results = {}

  for (const [key, fee] of Object.entries(fees)) {
    results[key] = {
      platformName: fee.name,
      ...calcPlatformProfit(values, fee),
    }
  }

  return results
}
