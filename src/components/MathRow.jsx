import { fmt } from '../utils/format'

// Section header row inside a math table
export function SH({ label, color }) {
  return (
    <tr>
      <td
        colSpan={2}
        style={{
          padding: '9px 3px 3px',
          fontSize: 10.5,
          fontWeight: 800,
          color: color || '#1e40af',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          borderTop: `2px solid ${color || '#1e40af'}33`,
        }}
      >
        {label}
      </td>
    </tr>
  )
}

// A single data row in a math table
// Props:
//   label   - row label text
//   value   - number or string to display
//   green   - hint that value is positive/income (auto-overridden if negative)
//   red     - hint that value is a cost/outflow
//   bold    - bold the value
//   indent  - indent the label
//   sub     - smaller muted label (for sub-notes)
//   sep     - renders a thin separator line instead
export function MR({ label, value, green, red, bold, indent, sep, sub }) {
  if (sep) {
    return (
      <tr>
        <td colSpan={2} style={{ borderTop: '1px solid #e2e8f0', padding: '2px 0' }} />
      </tr>
    )
  }

  const display = typeof value === 'string' ? value : value != null ? fmt(value) : '—'

  // Auto-detect actual numeric sign to prevent green showing on negative values
  let numV = NaN
  if (typeof value === 'number') {
    numV = value
  } else if (typeof value === 'string') {
    const stripped = value.replace(/[$,%\s]/g, '')
    const p = parseFloat(stripped.replace(/[()]/g, ''))
    numV = !isNaN(p) ? (value.includes('(') ? -p : p) : NaN
  }

  let color = '#475569'
  if (green && !isNaN(numV) && numV < 0) color = '#dc2626' // negative overrides green
  else if (green) color = '#16a34a'
  else if (red && !isNaN(numV) && numV > 0) color = '#475569' // positive overrides red
  else if (red) color = '#dc2626'

  return (
    <tr>
      <td
        style={{
          padding: '2.5px 3px',
          paddingLeft: indent ? 14 : sub ? 8 : 3,
          fontSize: sub ? 11 : 12,
          color: sub ? '#64748b' : '#334155',
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: '2.5px 3px',
          textAlign: 'right',
          fontSize: 12,
          fontWeight: bold ? 700 : 400,
          color,
        }}
      >
        {display}
      </td>
    </tr>
  )
}
