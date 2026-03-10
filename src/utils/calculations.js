// ─── CORE MATH HELPERS ───────────────────────────────────────────────────────

// Monthly mortgage payment
function pmt(balance, annualRate, months) {
  const r = annualRate / 100 / 12
  if (r === 0) return balance / months
  return (balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

// Remaining mortgage balance after n months of payments
function balAfter(balance, annualRate, payment, months) {
  const r = annualRate / 100 / 12
  if (r === 0) return Math.max(0, balance - payment * months)
  return balance * Math.pow(1 + r, months) - (payment * (Math.pow(1 + r, months) - 1)) / r
}

// Sum of escalating annual payments: monthly * 12 * (1+esc%)^0 + ... + ^(years-1)
function sumEscalating(monthly, escPct, years) {
  let total = 0
  for (let y = 0; y < years; y++) total += monthly * 12 * Math.pow(1 + escPct / 100, y)
  return total
}

// Compound growth of a principal
function grow(principal, annualRate, years) {
  return principal * Math.pow(1 + annualRate / 100, years)
}

// Capital gains tax with $500k married primary exclusion
function capGains(salePrice, basis, taxRate) {
  const gain = salePrice - basis
  const taxable = Math.max(0, gain - 500000)
  return { gain, taxable, tax: (taxable * taxRate) / 100 }
}

// ─── MAIN CALCULATION ────────────────────────────────────────────────────────

export function calcAll(inp) {
  const costBasis = inp.purchasePrice + inp.renovationCosts

  // ── HISTORICAL BUY (2019 → today) ─────────────────────────────────────────
  const histLoan    = inp.purchasePrice - inp.downPayment
  const histPmt     = pmt(histLoan, inp.originalRate, 360)
  const histBalance = inp.mortgageBalance // use actual balance on file

  const histTotalMtg   = histPmt * inp.holdYears * 12
  const histTotalMaint = sumEscalating(inp.monthlyMaint, inp.maintEsc, inp.holdYears)
  const histTotalCost  = histTotalMtg + histTotalMaint

  const histSellingCosts = inp.currentValue * (inp.sellingCostPct / 100)
  const histNetProceeds  = inp.currentValue - histBalance - histSellingCosts
  const histCG           = capGains(inp.currentValue, costBasis, inp.capGainsRate)
  const histNetAfterTax  = histNetProceeds - histCG.tax
  const histMaintYr7     = inp.monthlyMaint * Math.pow(1 + inp.maintEsc / 100, inp.holdYears - 1)

  const histBuy = {
    loan: histLoan,
    pmt: histPmt,
    balance: histBalance,
    totalMtg: histTotalMtg,
    totalMaint: histTotalMaint,
    totalCost: histTotalCost,
    sellingCosts: histSellingCosts,
    netProceeds: histNetProceeds,
    ...histCG,
    netAfterTax: histNetAfterTax,
    monthlyCostYr1: histPmt + inp.monthlyMaint,
    maintYr7: histMaintYr7,
    monthlyCostYr7: histPmt + histMaintYr7,
  }

  // ── HISTORICAL RENT WHAT-IF (2019 → today) ────────────────────────────────
  const histRentPortfolio     = grow(inp.downPayment, inp.portfolioReturn, inp.holdYears)
  const histRentInvGain       = histRentPortfolio - inp.downPayment
  const histRentInvTax        = Math.max(0, histRentInvGain) * (inp.investmentTaxRate / 100)
  const histRentPortfolioATax = histRentPortfolio - histRentInvTax
  const histTotalRent         = sumEscalating(inp.startRent, inp.rentEsc, inp.holdYears)
  const histRentYrLast        = inp.startRent * Math.pow(1 + inp.rentEsc / 100, inp.holdYears - 1)
  const histRentMonthlyAvg    = histTotalRent / (inp.holdYears * 12)

  const histRent = {
    portfolio: histRentPortfolio,
    invGain: histRentInvGain,
    invTax: histRentInvTax,
    portfolioAfterTax: histRentPortfolioATax,
    totalRent: histTotalRent,
    rentYr1: inp.startRent,
    rentYrLast: histRentYrLast,
    monthlyAvg: histRentMonthlyAvg,
  }

  // ── SCENARIO 2 — SELL TODAY + RENT ────────────────────────────────────────
  const sc2SellingCosts      = inp.currentValue * (inp.sellingCostPct / 100)
  const sc2NetProceeds       = inp.currentValue - inp.mortgageBalance - sc2SellingCosts
  const sc2CG                = capGains(inp.currentValue, costBasis, inp.capGainsRate)
  const sc2StartingPortfolio = sc2NetProceeds - sc2CG.tax
  const sc2Portfolio         = sc2StartingPortfolio > 0
    ? grow(sc2StartingPortfolio, inp.portfolioReturn, inp.forwardYears)
    : sc2StartingPortfolio
  const sc2InvGain           = sc2Portfolio - sc2StartingPortfolio
  const sc2InvTax            = Math.max(0, sc2InvGain) * (inp.investmentTaxRate / 100)
  const sc2PortfolioAfterTax = sc2Portfolio - sc2InvTax
  const sc2TotalRent         = inp.newRent * 12 * inp.forwardYears

  const sc2 = {
    sellingCosts: sc2SellingCosts,
    netProceeds: sc2NetProceeds,
    ...sc2CG,
    startingPortfolio: sc2StartingPortfolio,
    portfolio: sc2Portfolio,
    invGain: sc2InvGain,
    invTax: sc2InvTax,
    portfolioAfterTax: sc2PortfolioAfterTax,
    totalRent: sc2TotalRent,
    monthlyCost: inp.newRent,
  }

  // ── SCENARIO 3 — KEEP AT NEW RATE ─────────────────────────────────────────
  const sc3Pmt     = pmt(inp.mortgageBalance, inp.newRate, inp.remainingMonths)
  const fwdMonths  = inp.forwardYears * 12
  const sc3Balance = balAfter(inp.mortgageBalance, inp.newRate, sc3Pmt, fwdMonths)
  const sc3HomeVal = grow(inp.currentValue, inp.homeAppr, inp.forwardYears)
  const sc3Equity  = sc3HomeVal - sc3Balance
  const sc3SelCosts       = sc3HomeVal * (inp.sellingCostPct / 100)
  const sc3NetSold        = sc3HomeVal - sc3Balance - sc3SelCosts
  const sc3CG             = capGains(sc3HomeVal, costBasis, inp.capGainsRate)
  const sc3NetSoldAfterTax = sc3NetSold - sc3CG.tax
  const startEquity  = inp.currentValue - inp.mortgageBalance
  const equityGained = sc3Equity - startEquity

  let sc3TotalCost = 0
  for (let y = 0; y < inp.forwardYears; y++) {
    sc3TotalCost += (sc3Pmt + inp.monthlyMaint * Math.pow(1 + inp.maintEsc / 100, y)) * 12
  }

  // Sensitivity table: how does appreciation affect "Keep" scenarios vs "Sell+Rent"?
  const sc3NetAtAppr = (appr) => {
    const hv = grow(inp.currentValue, appr, inp.forwardYears)
    return hv - sc3Balance - hv * (inp.sellingCostPct / 100)
  }

  const sc3 = {
    pmt: sc3Pmt,
    balance: sc3Balance,
    homeVal: sc3HomeVal,
    equity: sc3Equity,
    selCosts: sc3SelCosts,
    netSold: sc3NetSold,
    ...sc3CG,
    netSoldAfterTax: sc3NetSoldAfterTax,
    startEquity,
    equityGained,
    totalCost: sc3TotalCost,
    monthlyCostYr1: sc3Pmt + inp.monthlyMaint,
  }

  // ── SCENARIO 4A — LUMP SUM PAYDOWN + KEEP ────────────────────────────────
  const sc4aBalance     = inp.mortgageBalance - inp.lumpSum
  const sc4aPmt         = pmt(sc4aBalance, inp.newRate, inp.remainingMonths)
  const sc4aFwdBalance  = balAfter(sc4aBalance, inp.newRate, sc4aPmt, fwdMonths)
  const sc4aHomeVal     = grow(inp.currentValue, inp.homeAppr, inp.forwardYears)
  const sc4aSelCosts    = sc4aHomeVal * (inp.sellingCostPct / 100)
  const sc4aNetSold     = sc4aHomeVal - sc4aFwdBalance - sc4aSelCosts
  const sc4aCG          = capGains(sc4aHomeVal, costBasis, inp.capGainsRate)
  const sc4aNetSoldATax = sc4aNetSold - sc4aCG.tax

  let sc4aTotalCost = 0
  for (let y = 0; y < inp.forwardYears; y++) {
    sc4aTotalCost += (sc4aPmt + inp.monthlyMaint * Math.pow(1 + inp.maintEsc / 100, y)) * 12
  }

  const sc4aNetAtAppr = (appr) => {
    const hv      = grow(inp.currentValue, appr, inp.forwardYears)
    const netSold = hv - sc4aFwdBalance - hv * (inp.sellingCostPct / 100)
    const cg      = capGains(hv, costBasis, inp.capGainsRate)
    return netSold - cg.tax - sc4aTotalCost
  }

  const sc4a = {
    lumpSum: inp.lumpSum,
    balance: sc4aBalance,
    pmt: sc4aPmt,
    fwdBalance: sc4aFwdBalance,
    homeVal: sc4aHomeVal,
    selCosts: sc4aSelCosts,
    netSold: sc4aNetSold,
    ...sc4aCG,
    netSoldAfterTax: sc4aNetSoldATax,
    totalCost: sc4aTotalCost,
    monthlyCostYr1: sc4aPmt + inp.monthlyMaint,
  }

  // ── SCENARIO 4B — SELL + RENT + INVEST LUMP SUM ──────────────────────────
  // Same sell/rent as sc2, plus the lump sum invested separately
  const sc4bLumpPortfolio  = grow(inp.lumpSum, inp.portfolioReturn, inp.forwardYears)
  const sc4bLumpGain       = sc4bLumpPortfolio - inp.lumpSum
  const sc4bLumpTax        = Math.max(0, sc4bLumpGain) * (inp.investmentTaxRate / 100)
  const sc4bLumpAfterTax   = sc4bLumpPortfolio - sc4bLumpTax
  const sc4bTotalPortATax  = sc2.portfolioAfterTax + sc4bLumpAfterTax

  const sc4b = {
    lumpPortfolio: sc4bLumpPortfolio,
    lumpGain: sc4bLumpGain,
    lumpTax: sc4bLumpTax,
    lumpAfterTax: sc4bLumpAfterTax,
    totalPortfolioAfterTax: sc4bTotalPortATax,
    totalRent: sc2.totalRent,
  }

  // Old payment at original rate (for Scenario 3 comparison)
  const oldPmt = pmt(histLoan, inp.originalRate, 360)

  // ── NET FINANCIAL POSITIONS (ending wealth − all money spent) ─────────────
  histBuy.netPosition  = histBuy.netAfterTax          - histBuy.totalCost
  histRent.netPosition = histRent.portfolioAfterTax   - histRent.totalRent
  sc2.netPosition      = sc2.portfolioAfterTax        - sc2.totalRent
  sc3.netPosition      = sc3.netSoldAfterTax          - sc3.totalCost
  // 4A: lump sum reduces mortgage → comes back via higher equity in netSoldAfterTax, don't double-count
  sc4a.netPosition     = sc4a.netSoldAfterTax         - sc4a.totalCost
  // 4B: sell (sc2) + invest lump sum — lump sum goes into portfolio, already in totalPortfolioAfterTax
  sc4b.netPosition     = sc4b.totalPortfolioAfterTax  - sc4b.totalRent

  // Sensitivity rows comparing NET positions at each appreciation rate
  const sensitivityRows = [0, 1, 2, 3, 4, 5, 6].map((appr) => ({
    appr,
    homeVal: grow(inp.currentValue, appr, inp.forwardYears),
    netSold: sc3NetAtAppr(appr),
    sc3Net:  sc3NetAtAppr(appr) - sc3TotalCost,
    sc4aNet: sc4aNetAtAppr(appr),
    sc2Net:  sc2.netPosition,
    sc4bNet: sc4b.netPosition,
  }))
  sc3.sensitivityRows = sensitivityRows

  return { histBuy, histRent, sc2, sc3, sc4a, sc4b, costBasis, oldPmt }
}
