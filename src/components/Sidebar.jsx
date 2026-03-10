import { NumberInput } from './NumberInput'

export function Sidebar({ inp, upd }) {
  return (
    <div className="sidebar">
      <div className="sidebar-title">
        <h2>NYC Apartment Calculator</h2>
        <p>Adjust any input to update all scenarios</p>
      </div>
      <div className="sidebar-body">

        <div className="igroup">
          <div className="igroup-label">Current Property</div>
          <NumberInput label="Current Market Value"     value={inp.currentValue}    onChange={v => upd('currentValue', v)}    step={5000} />
          <NumberInput label="Mortgage Balance (today)" value={inp.mortgageBalance} onChange={v => upd('mortgageBalance', v)} step={1000} />
          <NumberInput label="Selling Costs"            value={inp.sellingCostPct}  onChange={v => upd('sellingCostPct', v)}  step={0.5} pfx="" sfx="%" />
          <NumberInput label="Monthly Maintenance"      value={inp.monthlyMaint}    onChange={v => upd('monthlyMaint', v)}    step={50} />
          <NumberInput label="Maintenance Escalator"    value={inp.maintEsc}        onChange={v => upd('maintEsc', v)}        step={0.5} pfx="" sfx="%" />
        </div>

        <div className="igroup">
          <div className="igroup-label">Historical Purchase (2019)</div>
          <NumberInput label="Purchase Price"           value={inp.purchasePrice}   onChange={v => upd('purchasePrice', v)}   step={5000} />
          <NumberInput label="Down Payment"             value={inp.downPayment}     onChange={v => upd('downPayment', v)}     step={5000} />
          <NumberInput label="Renovation Costs"         value={inp.renovationCosts} onChange={v => upd('renovationCosts', v)} step={1000} />
          <NumberInput label="Original Mortgage Rate"   value={inp.originalRate}    onChange={v => upd('originalRate', v)}    step={0.25} pfx="" sfx="%" />
          <NumberInput label="Years Held (2019 → Now)"  value={inp.holdYears}       onChange={v => upd('holdYears', v)}       step={1} pfx="" />
        </div>

        <div className="igroup">
          <div className="igroup-label">Historical Rent (What-if)</div>
          <NumberInput label="Starting Monthly Rent"    value={inp.startRent}       onChange={v => upd('startRent', v)}       step={100} />
          <NumberInput label="Annual Rent Escalator"    value={inp.rentEsc}         onChange={v => upd('rentEsc', v)}         step={0.5} pfx="" sfx="%" />
        </div>

        <div className="igroup">
          <div className="igroup-label">Forward: Sell + Rent (Sc. 2)</div>
          <NumberInput label="New Monthly Rent"         value={inp.newRent}         onChange={v => upd('newRent', v)}         step={250} />
          <NumberInput label="Years to Hold (Forward)"  value={inp.forwardYears}    onChange={v => upd('forwardYears', v)}    step={1} pfx="" />
        </div>

        <div className="igroup">
          <div className="igroup-label">Forward: Keep at New Rate (Sc. 3 &amp; 4)</div>
          <NumberInput label="New Mortgage Rate"        value={inp.newRate}         onChange={v => upd('newRate', v)}         step={0.25} pfx="" sfx="%" />
          <NumberInput label="Remaining Loan Months"    value={inp.remainingMonths} onChange={v => upd('remainingMonths', v)} step={12} pfx="" />
        </div>

        <div className="igroup">
          <div className="igroup-label">Scenario 4: Lump Sum Paydown</div>
          <NumberInput label="Lump Sum Payment"         value={inp.lumpSum}         onChange={v => upd('lumpSum', v)}         step={10000} />
        </div>

        <div className="igroup">
          <div className="igroup-label">Shared Assumptions</div>
          <NumberInput label="Portfolio Return"         value={inp.portfolioReturn} onChange={v => upd('portfolioReturn', v)} step={0.5} pfx="" sfx="%" />
          <NumberInput label="Home Appreciation / yr"   value={inp.homeAppr}        onChange={v => upd('homeAppr', v)}        step={0.5} pfx="" sfx="%" />
          <NumberInput label="Capital Gains Rate (RE)"   value={inp.capGainsRate}      onChange={v => upd('capGainsRate', v)}      step={1} pfx="" sfx="%" />
          <NumberInput label="Investment Tax Rate (LT)"  value={inp.investmentTaxRate} onChange={v => upd('investmentTaxRate', v)} step={1}   pfx="" sfx="%" />
          <NumberInput label="Marginal Income Tax Rate"  value={inp.marginalTaxRate}   onChange={v => upd('marginalTaxRate', v)}   step={1}   pfx="" sfx="%" />
          <NumberInput label="Deductible % of Maint."   value={inp.maintDeductPct}    onChange={v => upd('maintDeductPct', v)}    step={5}   pfx="" sfx="%" />
        </div>

      </div>
    </div>
  )
}
