import { fmt } from '../utils/format'
import { SH, MR } from './MathRow'

export function ForwardPanel({ r, inp }) {
  const s2 = r.sc2
  const s3 = r.sc3

  const sc2wins = s2.netPosition > s3.netPosition
  const diff    = s3.netPosition - s2.netPosition

  return (
    <div className="panel">
      <div className="panel-hdr" style={{ background: '#f0fdf9', borderBottom: '1px solid #a7f3d0' }}>
        <span className="tag" style={{ color: '#047857' }}>Forward Outlook</span>
        <h3 style={{ color: '#047857' }}>
          2026 → {2026 + inp.forwardYears} — Next {inp.forwardYears} Years ({inp.forwardYears === 3 ? 'Years 8–10 Since Purchase' : `${inp.forwardYears} Years Forward`})
        </h3>
        <span className="sub" style={{ color: '#10b981' }}>Starting equity today: {fmt(s3.startEquity)}</span>
      </div>

      <div className="panel-body">
        <div className="two-col">

          {/* SCENARIO 2 */}
          <div className="col-card" style={{ background: '#fff7ed', border: '1.5px solid #fed7aa' }}>
            <h4 style={{ color: '#c2410c' }}>SCENARIO 2 — Sell Today, Invest, Rent at {fmt(-inp.newRent)}/mo</h4>
            <table className="math-tbl"><tbody>
              <SH label="Sell Co-op Now" color="#c2410c" />
              <MR label="Current market value"                    value={inp.currentValue}     />
              <MR label="− Mortgage payoff"                       value={-inp.mortgageBalance} red indent />
              <MR label={`− Selling costs (${inp.sellingCostPct}%)`} value={-s2.sellingCosts}  red indent />
              <MR label="Capital gain / (loss)"                   value={s2.gain} />
              <MR label={s2.gain > 500000 ? '− $500k married exclusion' : '(loss — no tax owed)'} value={s2.gain > 500000 ? -500000 : 0} green sub />
              {s2.tax > 0 && <MR label={`Capital gains tax (${inp.capGainsRate}%)`} value={-s2.tax} red indent />}
              <MR sep />
              <MR label="Net proceeds → invested"                 value={s2.startingPortfolio} green bold />
              <MR sep />
              <SH label={`Portfolio Over ${inp.forwardYears} Years`} color="#c2410c" />
              <MR label={`Portfolio return @ ${inp.portfolioReturn}%/yr`} value={inp.portfolioReturn + '%/yr'} />
              <MR label={`Portfolio after ${inp.forwardYears} years (pre-tax)`} value={s2.portfolio} green bold />
              <MR label="Investment gain"                         value={s2.invGain}           sub />
              <MR label={`− LT capital gains tax (${inp.investmentTaxRate}%)`} value={-s2.invTax} red indent />
              <MR label="Portfolio after tax (if liquidated)"     value={s2.portfolioAfterTax} green bold />
              <MR sep />
              <SH label="Rent Cost" color="#c2410c" />
              <MR label="Monthly rent"                            value={-inp.newRent}         red indent />
              <MR label={`Total rent over ${inp.forwardYears} years`} value={-s2.totalRent}    red bold />
              <MR sep />
              <SH label="Total In vs Total Out" color="#c2410c" />
              <MR label="Portfolio after tax"                     value={s2.portfolioAfterTax} green indent />
              <MR label="− Total rent paid"                       value={-s2.totalRent}        red indent />
              <MR sep />
              <MR label="NET FINANCIAL POSITION"                  value={s2.netPosition}       bold green={s2.netPosition >= 0} red={s2.netPosition < 0} />
            </tbody></table>
          </div>

          {/* SCENARIO 3 */}
          <div className="col-card" style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
            <h4 style={{ color: '#047857' }}>SCENARIO 3 — Keep Apartment, Refinance to {inp.newRate}%</h4>
            <table className="math-tbl"><tbody>
              <SH label="New Mortgage" color="#047857" />
              <MR label={`Old payment @ ${inp.originalRate}%`} value={-r.oldPmt}             sub />
              <MR label={`New payment @ ${inp.newRate}%`}      value={-s3.pmt}               red bold />
              <MR label="Monthly payment increase"             value={-(s3.pmt - r.oldPmt)}  red sub />
              <MR label="Monthly maintenance (yr 1)"           value={-inp.monthlyMaint}     red indent />
              <MR label="Total monthly cost (yr 1)"            value={-s3.monthlyCostYr1}    red bold />
              <MR sep />
              <SH label={`After ${inp.forwardYears} Years (${inp.homeAppr}% appreciation)`} color="#047857" />
              <MR label={`Home value (${inp.homeAppr}%/yr)`}   value={s3.homeVal}            green />
              <MR label="Remaining mortgage balance"           value={-s3.balance}           red indent />
              <MR label="Home equity"                          value={s3.equity}             green bold />
              <MR label="Equity gained since today"            value={s3.equityGained}       green sub />
              <MR sep />
              <SH label="If Selling at End" color="#047857" />
              <MR label={`− Selling costs (${inp.sellingCostPct}%)`} value={-s3.selCosts}   red indent />
              {s3.tax > 0 && <MR label={`− Capital gains tax (${inp.capGainsRate}%)`} value={-s3.tax} red indent />}
              <MR label="Net proceeds after tax"               value={s3.netSoldAfterTax}    green bold />
              <MR sep />
              <SH label="Total In vs Total Out" color="#047857" />
              <MR label={`Mortgage + maintenance (${inp.forwardYears} yrs)`} value={-s3.totalCost}      red indent />
              <MR label={`+ Tax deductions (int + ${inp.maintDeductPct}% maint @ ${inp.marginalTaxRate}%)`} value={s3.taxSavings} green indent />
              <MR label="Net proceeds if sold"                 value={s3.netSoldAfterTax}    green indent />
              <MR sep />
              <MR label="NET FINANCIAL POSITION"               value={s3.netPosition}        bold green={s3.netPosition >= 0} red={s3.netPosition < 0} />
            </tbody></table>
          </div>

        </div>

        {/* VERDICT */}
        <div className="verdict-box" style={{
          background: sc2wins ? '#fff7ed' : '#f0fdf4',
          border: `1.5px solid ${sc2wins ? '#fed7aa' : '#bbf7d0'}`,
          marginTop: 14,
        }}>
          <div className="vt" style={{ color: sc2wins ? '#c2410c' : '#047857' }}>
            {inp.forwardYears}-Year Verdict — {sc2wins ? 'Selling + Renting comes out ahead' : 'Keeping the apartment comes out ahead'}
          </div>
          <div className="vl">
            <strong>Sell+Rent net position: {fmt(s2.netPosition)}</strong> (portfolio after tax {fmt(s2.portfolioAfterTax)} − rent {fmt(-s2.totalRent)})
            {' '}vs <strong>Keep net position: {fmt(s3.netPosition)}</strong> (proceeds {fmt(s3.netSoldAfterTax)} − costs {fmt(-s3.totalCost)}).
            {' '}{sc2wins ? 'Selling now' : 'Keeping'} wins by <strong>{fmt(Math.abs(diff))}</strong> on total-in vs total-out at {inp.homeAppr}% appreciation.
            {' '}Monthly cost difference: keeping {fmt(-s3.monthlyCostYr1)}/mo vs renting {fmt(-inp.newRent)}/mo
            {' '}({fmt(-(s3.monthlyCostYr1 - inp.newRent))}/mo {s3.monthlyCostYr1 > inp.newRent ? 'more' : 'less'} to keep).
          </div>
        </div>

      </div>
    </div>
  )
}
