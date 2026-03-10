import { useState, useMemo, useCallback } from 'react'
import { DEFAULTS } from './constants'
import { calcAll } from './utils/calculations'
import { fmt } from './utils/format'
import { Sidebar } from './components/Sidebar'
import { HistoricalPanel } from './components/HistoricalPanel'
import { ForwardPanel } from './components/ForwardPanel'
import { ComparisonPanel } from './components/ComparisonPanel'
import './App.css'

export default function App() {
  const [inp, setInp] = useState(DEFAULTS)
  const upd = useCallback((k, v) => setInp(p => ({ ...p, [k]: v })), [])
  const r = useMemo(() => calcAll(inp), [inp])

  return (
    <div className="layout">
      <Sidebar inp={inp} upd={upd} />
      <div className="main">
        <div className="page-header">
          <div>
            <h1>NYC Co-op Apartment Decision Calculator</h1>
            <p>Three scenarios: historical buy/rent comparison (2019), sell today + rent, or keep at new rate</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, color: '#64748b' }}>
            <div>Cost basis: {fmt(inp.purchasePrice + inp.renovationCosts)}</div>
            <div>Today's equity: {fmt(inp.currentValue - inp.mortgageBalance)}</div>
          </div>
        </div>
        <HistoricalPanel r={r} inp={inp} />
        <ForwardPanel    r={r} inp={inp} />
        <ComparisonPanel r={r} inp={inp} />
      </div>
    </div>
  )
}
