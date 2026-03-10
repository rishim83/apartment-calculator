// Format a number as currency: $1,234 or ($1,234) for negatives
export function fmt(v) {
  if (v == null || isNaN(v)) return '—'
  const abs = Math.abs(Math.round(v))
  const s = '$' + abs.toLocaleString()
  return v < 0 ? '(' + s + ')' : s
}

export function fmtPct(v) {
  return v == null || isNaN(v) ? '—' : v.toFixed(1) + '%'
}

export function fmtNum(v) {
  return v == null || isNaN(v) ? '—' : Math.round(v).toLocaleString()
}
