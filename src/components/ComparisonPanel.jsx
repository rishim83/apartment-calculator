import { fmt } from '../utils/format'

export function ComparisonPanel({ r, inp }) {
  const b  = r.histBuy
  const s2 = r.sc2
  const s3 = r.sc3

  return (
    <div className="panel">
      <div className="panel-hdr" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <span className="tag" style={{ color: '#475569' }}>Summary</span>
        <h3 style={{ color: '#1e293b' }}>Full Comparison — All Scenarios</h3>
      </div>

      <div className="panel-body">

        {/* Main comparison table */}
        <table className="cmp-tbl" style={{ marginBottom: 20 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ textAlign: 'left', padding: '7px 10px', fontSize: 11, color: '#64748b', width: '34%' }}>Metric</th>
              <th style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                Historical Buy<br /><span style={{ fontWeight: 400, fontSize: 10 }}>2019 → now</span>
              </th>
              <th style={{ background: '#faf5ff', color: '#7c3aed' }}>
                Historical Rent<br /><span style={{ fontWeight: 400, fontSize: 10 }}>2019 → now (what-if)</span>
              </th>
              <th style={{ background: '#fff7ed', color: '#c2410c' }}>
                Sc.2: Sell + Rent<br /><span style={{ fontWeight: 400, fontSize: 10 }}>now → +{inp.forwardYears}yr</span>
              </th>
              <th style={{ background: '#f0fdf4', color: '#047857' }}>
                Sc.3: Keep @ {inp.newRate}%<br /><span style={{ fontWeight: 400, fontSize: 10 }}>now → +{inp.forwardYears}yr</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600 }}>Monthly Cost (yr 1)</td>
              <td style={{ background: '#eff6ff' }}>{fmt(-(b.pmt + inp.monthlyMaint))}</td>
              <td style={{ background: '#faf5ff' }}>{fmt(-inp.startRent)}</td>
              <td style={{ background: '#fff7ed' }}>{fmt(-inp.newRent)}</td>
              <td style={{ background: '#f0fdf4' }}>{fmt(-s3.monthlyCostYr1)}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600 }}>Total Housing / Rent Costs</td>
              <td style={{ background: '#eff6ff' }}>{fmt(-b.totalCost)}</td>
              <td style={{ background: '#faf5ff' }}>{fmt(-r.histRent.totalRent)}</td>
              <td style={{ background: '#fff7ed' }}>{fmt(-s2.totalRent)}</td>
              <td style={{ background: '#f0fdf4' }}>{fmt(-s3.totalCost)}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600 }}>Ending Portfolio / Net if Sold</td>
              <td style={{ background: '#eff6ff' }}>{fmt(b.netAfterTax)}</td>
              <td style={{ background: '#faf5ff' }}>{fmt(r.histRent.portfolio)}</td>
              <td style={{ background: '#fff7ed' }}>{fmt(s2.portfolio)}</td>
              <td style={{ background: '#f0fdf4' }}>{fmt(s3.netSoldAfterTax)}</td>
            </tr>
            <tr style={{ background: '#f8f8f8' }}>
              <td style={{ color: '#1e293b', fontWeight: 700 }}>
                NET FINANCIAL POSITION<br />
                <span style={{ fontSize: 10, fontWeight: 400, color: '#64748b' }}>Ending value − all costs paid</span>
              </td>
              {[b.netPosition, r.histRent.netPosition, s2.netPosition, s3.netPosition].map((v, i) => {
                const bgs  = ['#eff6ff', '#faf5ff', '#fff7ed', '#f0fdf4']
                const cols = ['#1d4ed8', '#7c3aed', '#c2410c', '#047857']
                return (
                  <td key={i} style={{ background: bgs[i], fontWeight: 700, fontSize: 13, color: v >= 0 ? cols[i] : '#dc2626' }}>
                    {fmt(v)}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>

        {/* Sensitivity table */}
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#64748b', marginBottom: 8 }}>
            Sensitivity: Home Appreciation vs "Sell + Rent" — Net Financial Position Comparison
            <span style={{ fontWeight: 400, marginLeft: 8 }}>
              Sell+Rent net: <strong>{fmt(s2.netPosition)}</strong> (portfolio {fmt(s2.portfolio)} − rent {fmt(-s2.totalRent)})
            </span>
          </div>
          <table className="cmp-tbl">
            <thead>
              <tr style={{ background: '#334155', color: 'white' }}>
                <th style={{ color: 'white', textAlign: 'left' }}>Appreciation / yr</th>
                <th style={{ color: 'white' }}>Home Value {2026 + inp.forwardYears}</th>
                <th style={{ color: 'white' }}>Keep: Net if Sold</th>
                <th style={{ color: 'white' }}>
                  Keep: NET Position<br /><span style={{ fontWeight: 400, fontSize: 10 }}>(proceeds − costs)</span>
                </th>
                <th style={{ color: 'white' }}>
                  Sell+Rent NET<br /><span style={{ fontWeight: 400, fontSize: 10 }}>(portfolio − rent)</span>
                </th>
                <th style={{ color: 'white' }}>Difference</th>
                <th style={{ color: 'white', textAlign: 'center' }}>Winner</th>
              </tr>
            </thead>
            <tbody>
              {s3.sensitivityRows.map(row => {
                const wins = row.sc3Net > row.sc2Net
                return (
                  <tr key={row.pct} className={wins ? 'sens-row-win' : 'sens-row-lose'}>
                    <td style={{ fontWeight: row.pct === inp.homeAppr ? 700 : 400 }}>
                      {row.pct}% / yr {row.pct === inp.homeAppr ? '← base case' : ''}
                    </td>
                    <td>{fmt(inp.currentValue * Math.pow(1 + row.pct / 100, inp.forwardYears))}</td>
                    <td style={{ color: wins ? '#047857' : '#64748b' }}>{fmt(row.netSold)}</td>
                    <td style={{ fontWeight: 700, color: wins ? '#047857' : '#dc2626' }}>{fmt(row.sc3Net)}</td>
                    <td style={{ color: '#c2410c' }}>{fmt(row.sc2Net)}</td>
                    <td style={{ fontWeight: 600, color: wins ? '#047857' : '#dc2626' }}>
                      {wins ? '+' : ''}{fmt(row.sc3Net - row.sc2Net)}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: wins ? '#047857' : '#c2410c' }}>
                      {wins ? 'Keep' : 'Sell + Rent'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
