import { useState } from 'react'

// Numeric input with prefix/suffix, arrow-key nudging, and comma formatting
export function NumberInput({ label, value, onChange, step = 1000, pfx = '$', sfx = '' }) {
  const [focused, setFocused] = useState(false)
  const [raw, setRaw] = useState('')

  const onFocus = () => {
    setFocused(true)
    setRaw(String(value))
  }

  const onBlur = () => {
    setFocused(false)
    const v = parseFloat(String(raw).replace(/,/g, ''))
    if (!isNaN(v) && v >= 0) onChange(v)
    else onChange(value)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp')   { e.preventDefault(); onChange(value + step) }
    if (e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(0, value - step)) }
    if (e.key === 'Enter')     { e.target.blur() }
  }

  const display = focused ? raw : value.toLocaleString()

  return (
    <div className="irow">
      <label>{label}</label>
      <div className="input-wrap">
        {pfx && <span className="pfx">{pfx}</span>}
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => setRaw(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {sfx && <span className="sfx">{sfx}</span>}
      </div>
    </div>
  )
}
