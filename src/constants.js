export const DEFAULTS = {
  // Current state
  currentValue:    650000,
  mortgageBalance: 421943,
  sellingCostPct:  8.5,
  monthlyMaint:    2000,
  maintEsc:        3.0,

  // Historical purchase (2019)
  purchasePrice:   645000,
  downPayment:     120000,
  renovationCosts: 40000,
  originalRate:    3.0,
  holdYears:       7,

  // Historical rent alternative
  startRent:       3500,
  rentEsc:         3.0,

  // Forward Scenario 2: Sell + Rent
  newRent:         4500,
  forwardYears:    3,

  // Forward Scenario 3: Keep at new rate
  newRate:         6.0,
  remainingMonths: 282,

  // Scenario 4: Lump sum paydown + keep
  lumpSum:         200000,

  // Shared assumptions
  portfolioReturn: 8.5,
  homeAppr:        3.0,
  capGainsRate:    20,
  investmentTaxRate: 15,
}
