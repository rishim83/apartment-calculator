import { fmt } from '../utils/format'
import { SH, MR } from './MathRow'

export function HistoricalPanel({ r, inp }) {
  const b    = r.histBuy
  const rent = r.histRent

  const diff     = b.netPosition - rent.netPosition
  const buyAhead = diff > 0

  return (
    <div className="panel">
      <div className="panel-hdr" style={{ background: '#eff6ff', borderBottom: '1px solid #bfdbfe' }}>
        <span className="tag" style={{ color: '#1d4ed8' }}>Historical</span>
        <h3 style={{ color: '#1d4ed8' }}>
          2019 → {new Date().getFullYear()} — Did Buying Make Sense? ({inp.holdYears} Years)
        </h3>
        <span className="sub" style={{ color: '#3b82f6' }}>Cost basis: {fmt(r.costBasis)}</span>
      </div>

      <div className="panel-body">
        <div className="two-col">

          {/* BUY PATH */}
          <div className="col-card" style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
            <h4 style={{ color: '#1d4ed8' }}>BUY PATH — Purchased in 2019</h4>
            <table className="math-tbl"><tbody>
              <SH label="Purchase + Monthly Cost" color="#1d4ed8" />
              <MR label="Loan amount"                           value={b.loan} />
              <MR label={`Monthly mortgage @ ${inp.originalRate}%`} value={-b.pmt} red indent />
              <MR label="Monthly maintenance (yr 1)"            value={-inp.monthlyMaint} red indent />
              <MR label="Total monthly cost (yr 1)"             value={-(b.pmt + inp.monthlyMaint)} red bold />
              <MR sep />
              <SH label={`${inp.holdYears}-Year Housing Costs`} color="#1d4ed8" />
              <MR label={`Total mortgage paid (${inp.holdYears} yrs)`}  value={-b.totalMtg}   red indent />
              <MR label={`Total maintenance (${inp.holdYears} yrs)`}    value={-b.totalMaint} red indent />
              <MR label="Total housing costs paid"              value={-b.totalCost}  red bold />
              <MR sep />
              <SH label="Sell Today" color="#1d4ed8" />
              <MR label="Sale price (current value)"            value={inp.currentValue} />
              <MR label="− Mortgage payoff"                     value={-b.balance}    red indent />
              <MR label={`− Selling costs (${inp.sellingCostPct}%)`} value={-b.sellingCosts} red indent />
              <MR label="Capital gain / (loss)"                 value={b.gain} />
              <MR label={b.gain > 500000 ? '− $500k exclusion' : '(loss — no tax)'} value={b.gain > 500000 ? -500000 : 0} green sub />
              {b.tax > 0 && <MR label={`Capital gains tax (${inp.capGainsRate}%)`} value={-b.tax} red indent />}
              <MR sep />
              <MR label="Net proceeds (walk away with)"         value={b.netAfterTax} green bold />
              <MR sep />
              <SH label="Total In vs Total Out" color="#1d4ed8" />
              <MR label="Net proceeds received"                 value={b.netAfterTax}  green indent />
              <MR label="− Total housing costs paid"            value={-b.totalCost}   red indent />
              <MR sep />
              <MR label="NET FINANCIAL POSITION"                value={b.netPosition}  bold green={b.netPosition >= 0} red={b.netPosition < 0} />
            </tbody></table>
          </div>

          {/* RENT PATH */}
          <div className="col-card" style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff' }}>
            <h4 style={{ color: '#7c3aed' }}>RENT PATH — If You Had Rented Instead</h4>
            <table className="math-tbl"><tbody>
              <SH label="Investing the Down Payment" color="#7c3aed" />
              <MR label="Down payment (invested instead)"       value={inp.downPayment} />
              <MR label={`Portfolio return @ ${inp.portfolioReturn}%/yr`} value={inp.portfolioReturn + '%/yr'} />
              <MR label={`Portfolio after ${inp.holdYears} years`} value={rent.portfolio} green bold />
              <MR sep />
              <SH label="Rent Paid" color="#7c3aed" />
              <MR label="Monthly rent yr 1"                     value={-inp.startRent}     red indent />
              <MR label={`Monthly rent yr ${inp.holdYears}`}    value={-rent.rentYrLast}   red indent />
              <MR label={`Total rent paid (${inp.holdYears} yrs)`} value={-rent.totalRent} red bold />
              <MR sep />
              <SH label="Total In vs Total Out" color="#7c3aed" />
              <MR label="Portfolio (invested down payment)"     value={rent.portfolio}    green indent />
              <MR label="− Total rent paid"                     value={-rent.totalRent}   red indent />
              <MR sep />
              <MR label="NET FINANCIAL POSITION"                value={rent.netPosition}  bold green={rent.netPosition >= 0} red={rent.netPosition < 0} />
            </tbody></table>
          </div>

        </div>

        {/* VERDICT */}
        <div className="verdict-box" style={{
          background: buyAhead ? '#eff6ff' : '#faf5ff',
          border: `1.5px solid ${buyAhead ? '#bfdbfe' : '#e9d5ff'}`,
        }}>
          <div className="vt" style={{ color: buyAhead ? '#1d4ed8' : '#7c3aed' }}>
            Verdict — {buyAhead ? 'Buying came out ahead' : 'Renting came out ahead'}
          </div>
          <div className="vl">
            <strong>Buy net position: {fmt(b.netPosition)}</strong> vs <strong>Rent net position: {fmt(rent.netPosition)}</strong>
            {' — '}{buyAhead ? 'Buying' : 'Renting'} wins by <strong>{fmt(Math.abs(diff))}</strong> on a total-in-vs-total-out basis.
            {' '}Buy: walk away with {fmt(b.netAfterTax)} after spending {fmt(-b.totalCost)} on housing.
            {' '}Rent: portfolio {fmt(rent.portfolio)} after spending {fmt(-rent.totalRent)} on rent.
            {b.gain < 0 && ' Note: apartment sold below cost basis — no capital gains tax.'}
          </div>
        </div>

      </div>
    </div>
  )
}
