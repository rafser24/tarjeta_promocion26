import type { CardConfig } from './config'

export function parseDate(iso: string): Date | null {
  const d = new Date(iso)
  return isNaN(+d) ? null : d
}

export function dateParts(iso: string) {
  const d = parseDate(iso)
  if (!d) return { weekday: '', day: '', month: '', year: '', time: '' }
  const weekday = new Intl.DateTimeFormat('es', { weekday: 'long' }).format(d).toUpperCase()
  const month = new Intl.DateTimeFormat('es', { month: 'long' }).format(d).toUpperCase()
  let h = d.getHours()
  const m = d.getMinutes()
  const ap = h >= 12 ? 'P.M.' : 'A.M.'
  h = h % 12 || 12
  const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ap}`
  return { weekday, day: String(d.getDate()), month, year: String(d.getFullYear()), time }
}

const pad = (n: number) => String(n).padStart(2, '0')
const fmtLocal = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`

export function calendarRange(iso: string): [string, string] | null {
  const d = parseDate(iso)
  if (!d) return null
  return [fmtLocal(d), fmtLocal(new Date(+d + 3 * 3600_000))]
}

export function googleCalendarUrl(c: CardConfig): string {
  const r = calendarRange(c.invite.dateISO)
  if (!r) return ''
  const p = new URLSearchParams({
    action: 'TEMPLATE', text: c.invite.eventTitle || 'Graduación',
    dates: `${r[0]}/${r[1]}`, details: c.promo.school, location: c.invite.venue,
  })
  return `https://calendar.google.com/calendar/render?${p}`
}

export function downloadIcs(c: CardConfig) {
  const r = calendarRange(c.invite.dateISO)
  if (!r) return
  const esc = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Tarjeta Graduacion//ES', 'BEGIN:VEVENT',
    `UID:${r[0]}@tarjeta-graduacion`, `DTSTAMP:${r[0]}`, `DTSTART:${r[0]}`, `DTEND:${r[1]}`,
    `SUMMARY:${esc(c.invite.eventTitle || 'Graduación')}`, `LOCATION:${esc(c.invite.venue)}`,
    `DESCRIPTION:${esc(c.promo.school)}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'graduacion.ics'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
