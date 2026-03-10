import { fmt } from '../utils/format'

export function ComparisonPanel({ r, inp }) {
  const b   = r.histBuy
  const s2  = r.sc2
  const s3  = r.sc3
  const s4a = r.sc4a
  const s4b = r.sc4b

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
              <th style={{ background: '#eef2ff', color: '#4338ca' }}>
                Sc.4A: Pay Down + Keep<br /><span style={{ fontWeight: 400, fontSize: 10 }}>−{fmt(inp.lumpSum)} on mortgage</span>
              </th>
              <th style={{ background: '#ecfeff', color: '#0e7490' }}>
                Sc.4B: Sell + Invest {fmt(inp.lumpSum)}<br /><span style={{ fontWeight: 400, fontSize: 10 }}>now → +{inp.forwardYears}yr</span>
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
              <td style={{ background: '#eef2ff' }}>{fmt(-s4a.monthlyCostYr1)}</td>
              <td style={{ background: '#ecfeff' }}>{fmt(-inp.newRent)}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600 }}>Total Housing / Rent Costs</td>
              <td style={{ background: '#eff6ff' }}>{fmt(-b.totalCost)}</td>
              <td style={{ background: '#faf5ff' }}>{fmt(-r.histRent.totalRent)}</td>
              <td style={{ background: '#fff7ed' }}>{fmt(-s2.totalRent)}</td>
              <td style={{ background: '#f0fdf4' }}>{fmt(-s3.totalCost)}</td>
              <td style={{ background: '#eef2ff' }}>{fmt(-s4a.totalCost)}</td>
              <td style={{ background: '#ecfeff' }}>{fmt(-s4b.totalRent)}</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600 }}>Tax Deduction Savings<br /><span style={{ fontWeight: 400, fontSize: 10 }}>(mortgage int + {inp.maintDeductPct}% maint @ {inp.marginalTaxRate}%)</span></td>
              <td style={{ background: '#eff6ff', color: '#047857' }}>{fmt(b.taxSavings)}</td>
              <td style={{ background: '#faf5ff', color: '#94a3b8' }}>—</td>
              <td style={{ background: '#fff7ed', color: '#94a3b8' }}>—</td>
              <td style={{ background: '#f0fdf4', color: '#047857' }}>{fmt(s3.taxSavings)}</td>
              <td style={{ background: '#eef2ff', color: '#047857' }}>{fmt(s4a.taxSavings)}</td>
              <td style={{ background: '#ecfeff', color: '#94a3b8' }}>—</td>
            </tr>
            <tr>
              <td style={{ color: '#64748b', fontWeight: 600 }}>Ending Portfolio / Net if Sold<br /><span style={{ fontWeight: 400, fontSize: 10 }}>(after all taxes)</span></td>
              <td style={{ background: '#eff6ff' }}>{fmt(b.netAfterTax)}</td>
              <td style={{ background: '#faf5ff' }}>{fmt(r.histRent.portfolioAfterTax)}</td>
              <td style={{ background: '#fff7ed' }}>{fmt(s2.portfolioAfterTax)}</td>
              <td style={{ background: '#f0fdf4' }}>{fmt(s3.netSoldAfterTax)}</td>
              <td style={{ background: '#eef2ff' }}>{fmt(s4a.netSoldAfterTax)}</td>
              <td style={{ background: '#ecfeff' }}>{fmt(s4b.totalPortfolioAfterTax)}</td>
            </tr>
            <tr style={{ background: '#f8f8f8' }}>
              <td style={{ color: '#1e293b', fontWeight: 700 }}>
                NET FINANCIAL POSITION<br />
                <span style={{ fontSize: 10, fontWeight: 400, color: '#64748b' }}>Ending value − all costs paid</span>
              </td>
              {[b.netPosition, r.histRent.netPosition, s2.netPosition, s3.netPosition, s4a.netPosition, s4b.netPosition].map((v, i) => {
                const bgs  = ['#eff6ff', '#faf5ff', '#fff7ed', '#f0fdf4', '#eef2ff', '#ecfeff']
                const cols = ['#1d4ed8', '#7c3aed', '#c2410c', '#047857', '#4338ca', '#0e7490']
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
            Sensitivity: Home Appreciation — NET Financial Position (All Forward Scenarios)
            <span style={{ fontWeight: 400, marginLeft: 8 }}>
              Fixed refs — Sc.2: <strong>{fmt(s2.netPosition)}</strong> · Sc.4B: <strong>{fmt(s4b.netPosition)}</strong>
            </span>
          </div>
          <table className="cmp-tbl">
            <thead>
              <tr style={{ background: '#334155', color: 'white' }}>
                <th style={{ color: 'white', textAlign: 'left' }}>Appreciation / yr</th>
                <th style={{ color: 'white' }}>Home Value {2026 + inp.forwardYears}</th>
                <th style={{ color: 'white', background: '#1e3a5f' }}>
                  Sc.3: Keep NET<br /><span style={{ fontWeight: 400, fontSize: 10 }}>(proceeds − costs)</span>
                </th>
                <th style={{ color: 'white', background: '#312e81' }}>
                  Sc.4A: Pay Down NET<br /><span style={{ fontWeight: 400, fontSize: 10 }}>(proceeds − costs)</span>
                </th>
                <th style={{ color: 'white', background: '#7c2d12' }}>
                  Sc.2: Sell+Rent NET<br /><span style={{ fontWeight: 400, fontSize: 10 }}>(fixed)</span>
                </th>
                <th style={{ color: 'white', background: '#164e63' }}>
                  Sc.4B: Sell+Invest NET<br /><span style={{ fontWeight: 400, fontSize: 10 }}>(fixed)</span>
                </th>
                <th style={{ color: 'white', textAlign: 'center' }}>Winner</th>
              </tr>
            </thead>
            <tbody>
              {s3.sensitivityRows.map(row => {
                const nets = { 'Sc.3': row.sc3Net, 'Sc.4A': row.sc4aNet, 'Sc.2': row.sc2Net, 'Sc.4B': row.sc4bNet }
                const best = Object.entries(nets).reduce((a, b) => b[1] > a[1] ? b : a)[0]
                const isBase = row.appr === inp.homeAppr
                return (
                  <tr key={row.appr} style={{ background: isBase ? '#f0f9ff' : undefined }}>
                    <td style={{ fontWeight: isBase ? 700 : 400 }}>
                      {row.appr}% / yr {isBase ? '← base case' : ''}
                    </td>
                    <td>{fmt(row.homeVal)}</td>
                    <td style={{ fontWeight: 700, color: best === 'Sc.3' ? '#047857' : '#64748b' }}>{fmt(row.sc3Net)}</td>
                    <td style={{ fontWeight: 700, color: best === 'Sc.4A' ? '#4338ca' : '#64748b' }}>{fmt(row.sc4aNet)}</td>
                    <td style={{ fontWeight: 700, color: best === 'Sc.2' ? '#c2410c' : '#64748b' }}>{fmt(row.sc2Net)}</td>
                    <td style={{ fontWeight: 700, color: best === 'Sc.4B' ? '#0e7490' : '#64748b' }}>{fmt(row.sc4bNet)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700, color: best === 'Sc.3' ? '#047857' : best === 'Sc.4A' ? '#4338ca' : best === 'Sc.2' ? '#c2410c' : '#0e7490' }}>
                      {best}
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
