import { fmt } from '../utils/format'
import { SH, MR } from './MathRow'

export function Scenario4Panel({ r, inp }) {
  const s4a = r.sc4a
  const s4b = r.sc4b
  const s2  = r.sc2

  const s4aWins = s4a.netPosition > s4b.netPosition
  const diff    = s4a.netPosition - s4b.netPosition

  return (
    <div className="panel">
      <div className="panel-hdr" style={{ background: '#f5f3ff', borderBottom: '1px solid #ddd6fe' }}>
        <span className="tag" style={{ color: '#6d28d9' }}>Scenario 4 — Lump Sum Analysis</span>
        <h3 style={{ color: '#6d28d9' }}>
          Use {fmt(inp.lumpSum)} Cash: Pay Down Mortgage vs Invest + Rent
        </h3>
        <span className="sub" style={{ color: '#7c3aed' }}>
          Same {inp.forwardYears}-year horizon · {inp.homeAppr}% appreciation · {inp.portfolioReturn}% portfolio return
        </span>
      </div>

      <div className="panel-body">
        <div className="two-col">

          {/* SCENARIO 4A — LUMP SUM PAYDOWN + KEEP */}
          <div className="col-card" style={{ background: '#eef2ff', border: '1.5px solid #c7d2fe' }}>
            <h4 style={{ color: '#4338ca' }}>4A — Pay {fmt(inp.lumpSum)} on Mortgage, Keep Apartment</h4>
            <table className="math-tbl"><tbody>
              <SH label="Mortgage After Lump Sum" color="#4338ca" />
              <MR label="Current balance"                          value={-inp.mortgageBalance}  red indent />
              <MR label={`− Lump sum payment (cash out)`}          value={-inp.lumpSum}          red bold />
              <MR label="New balance"                              value={-s4a.balance}          red indent />
              <MR label={`New payment @ ${inp.newRate}% (${inp.remainingMonths} mo)`} value={-s4a.pmt} red bold />
              <MR label="Monthly maintenance (yr 1)"               value={-inp.monthlyMaint}     red indent />
              <MR label="Total monthly cost (yr 1)"                value={-s4a.monthlyCostYr1}   red bold />
              <MR sep />
              <SH label={`After ${inp.forwardYears} Years (${inp.homeAppr}% appreciation)`} color="#4338ca" />
              <MR label={`Home value (${inp.homeAppr}%/yr)`}       value={s4a.homeVal}           green />
              <MR label="Remaining mortgage balance"               value={-s4a.fwdBalance}       red indent />
              <MR label={`− Selling costs (${inp.sellingCostPct}%)`} value={-s4a.selCosts}       red indent />
              {s4a.tax > 0 && <MR label={`− Capital gains tax (${inp.capGainsRate}%)`} value={-s4a.tax} red indent />}
              <MR label="Net proceeds after tax"                   value={s4a.netSoldAfterTax}   green bold />
              <MR sep />
              <SH label="Total In vs Total Out" color="#4338ca" />
              <MR label={`Mortgage + maintenance (${inp.forwardYears} yrs)`} value={-s4a.totalCost}     red indent />
              <MR label="Net proceeds if sold"                     value={s4a.netSoldAfterTax}   green indent />
              <MR sep />
              <MR label="NET FINANCIAL POSITION"                   value={s4a.netPosition}       bold green={s4a.netPosition >= 0} red={s4a.netPosition < 0} />
            </tbody></table>
          </div>

          {/* SCENARIO 4B — SELL + RENT + INVEST LUMP SUM */}
          <div className="col-card" style={{ background: '#ecfeff', border: '1.5px solid #a5f3fc' }}>
            <h4 style={{ color: '#0e7490' }}>4B — Sell Apartment, Invest {fmt(inp.lumpSum)} + Proceeds, Rent</h4>
            <table className="math-tbl"><tbody>
              <SH label={`Sc.2 Portfolio (sell proceeds invested)`} color="#0e7490" />
              <MR label="Sc.2 net proceeds invested"               value={s2.startingPortfolio}  green indent />
              <MR label={`Sc.2 portfolio after ${inp.forwardYears} yrs (pre-tax)`} value={s2.portfolio} green />
              <MR label={`− LT cap gains tax on sc.2 portfolio`}   value={-s2.invTax}            red indent />
              <MR label="Sc.2 portfolio after tax"                 value={s2.portfolioAfterTax}  green bold />
              <MR sep />
              <SH label={`${fmt(inp.lumpSum)} Invested Separately`} color="#0e7490" />
              <MR label={`${fmt(inp.lumpSum)} @ ${inp.portfolioReturn}%/yr`} value={inp.portfolioReturn + '%/yr'} />
              <MR label={`Lump sum after ${inp.forwardYears} years (pre-tax)`} value={s4b.lumpPortfolio} green bold />
              <MR label="Investment gain"                           value={s4b.lumpGain}          sub />
              <MR label={`− LT capital gains tax (${inp.investmentTaxRate}%)`} value={-s4b.lumpTax} red indent />
              <MR label="Lump sum after tax"                       value={s4b.lumpAfterTax}      green bold />
              <MR sep />
              <SH label="Combined Portfolio" color="#0e7490" />
              <MR label="Sc.2 portfolio after tax"                 value={s2.portfolioAfterTax}  green indent />
              <MR label={`+ Lump sum after tax`}                   value={s4b.lumpAfterTax}      green indent />
              <MR label="Total portfolio after tax"                value={s4b.totalPortfolioAfterTax} green bold />
              <MR sep />
              <SH label="Rent Cost" color="#0e7490" />
              <MR label="Monthly rent"                             value={-inp.newRent}           red indent />
              <MR label={`Total rent over ${inp.forwardYears} years`} value={-s4b.totalRent}     red bold />
              <MR sep />
              <SH label="Total In vs Total Out" color="#0e7490" />
              <MR label="Total portfolio after tax"                value={s4b.totalPortfolioAfterTax} green indent />
              <MR label="− Total rent paid"                        value={-s4b.totalRent}         red indent />
              <MR sep />
              <MR label="NET FINANCIAL POSITION"                   value={s4b.netPosition}        bold green={s4b.netPosition >= 0} red={s4b.netPosition < 0} />
            </tbody></table>
          </div>

        </div>

        {/* VERDICT */}
        <div className="verdict-box" style={{
          background: s4aWins ? '#eef2ff' : '#ecfeff',
          border: `1.5px solid ${s4aWins ? '#c7d2fe' : '#a5f3fc'}`,
          marginTop: 14,
        }}>
          <div className="vt" style={{ color: s4aWins ? '#4338ca' : '#0e7490' }}>
            Lump Sum Verdict — {s4aWins ? 'Paying down the mortgage comes out ahead' : 'Selling + investing the lump sum comes out ahead'}
          </div>
          <div className="vl">
            <strong>Pay down net: {fmt(s4a.netPosition)}</strong> (proceeds {fmt(s4a.netSoldAfterTax)} − costs {fmt(-s4a.totalCost)})
            {' '}vs <strong>Sell+Invest net: {fmt(s4b.netPosition)}</strong> (combined portfolio {fmt(s4b.totalPortfolioAfterTax)} − rent {fmt(-s4b.totalRent)}).
            {' '}{s4aWins ? 'Paying down' : 'Selling + investing'} wins by <strong>{fmt(Math.abs(diff))}</strong>.
            {' '}Monthly cost: keeping {fmt(-s4a.monthlyCostYr1)}/mo vs renting {fmt(-inp.newRent)}/mo
            {' '}({fmt(-(s4a.monthlyCostYr1 - inp.newRent))}/mo {s4a.monthlyCostYr1 > inp.newRent ? 'more' : 'less'} to keep).
          </div>
        </div>

      </div>
    </div>
  )
}
