export const DEFAULTS = {
  // Current state
  currentValue:    675000,
  mortgageBalance: 421943,
  sellingCostPct:  9.5,
  monthlyMaint:    1700,
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
  newRent:         5000,
  forwardYears:    3,

  // Forward Scenario 3: Keep at new rate
  newRate:         6.0,
  remainingMonths: 282,

  // Shared assumptions
  portfolioReturn: 8.5,
  homeAppr:        3.0,
  capGainsRate:    20,
}
