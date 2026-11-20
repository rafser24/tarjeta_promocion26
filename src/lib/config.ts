import { z } from 'zod'
import LZ from 'lz-string'

const str = (max: number) => z.string().max(max)
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/)

export const configSchema = z.object({
  cover: z.object({ tagline: str(60), closing: str(60), tapHint: str(40), showLogo: z.boolean() }),
  promo: z.object({ label: str(24), year: str(8), motto: str(40), school: str(90), message: str(160) }),
  invite: z.object({
    intro: str(160), eventTitle: str(50), dateISO: str(30), venue: str(90), mapUrl: str(500), closingQuote: str(100),
  }),
  theme: z.object({ preset: str(30), primary: hex, accent: hex, paper: hex, paperOpacity: z.number().min(0.1).max(1) }),
  agenda: z.object({
    enabled: z.boolean(), title: str(40), colTime: str(20), colActivity: str(30),
    items: z.array(z.object({ time: str(14), activity: str(80) })).max(12),
  }),
  thanks: z.object({ enabled: z.boolean(), title: str(80), names: z.array(str(60)).max(20) }),
  roster: z.object({ enabled: z.boolean(), title: str(50), names: z.array(str(80)).max(80) }),
  graduate: z.object({ name: str(60) }),
  rsvp: z.object({ whatsapp: str(20), message: str(140) }),
  music: z.object({ enabled: z.boolean(), src: str(500) }),
  footerBrand: z.object({ enabled: z.boolean(), text: str(60) }),
  timing: z.object({ autoAdvance: z.boolean(), curtain: z.number(), page2At: z.number(), inviteStay: z.number(), agendaStay: z.number(), rosterStay: z.number(), thanksStay: z.number(), sweepAfter: z.number() }),
})
export type CardConfig = z.infer<typeof configSchema>

export const THEMES: Record<string, { name: string; primary: string; accent: string }> = {
  'navy-gold': { name: 'Azul y oro', primary: '#0B1B3F', accent: '#C9A24B' },
  'burgundy-gold': { name: 'Vino y oro', primary: '#4A0E1C', accent: '#C9A24B' },
  'forest-gold': { name: 'Verde y oro', primary: '#0F3322', accent: '#C9A24B' },
  'black-silver': { name: 'Negro y plata', primary: '#141414', accent: '#B8BCC4' },
  'royal-rose': { name: 'Ciruela y rosa', primary: '#5B1F4A', accent: '#D9A5A0' },
}

export const DEFAULT_CONFIG: CardConfig = {
  cover: { tagline: 'Una etapa termina…', closing: '¡Te esperamos!', tapHint: 'Toca para abrir', showLogo: true },
  promo: {
    label: 'PROMOCIÓN', year: '2026', motto: '',
    school: 'Complejo Educativo Cantón Guadalupe La Zorra',
    message: 'Cerramos una etapa llena de recuerdos y abrimos las puertas a nuevos sueños',
  },
  invite: {
    intro: 'Con mucha alegría, te invitamos a celebrar un momento inolvidable: nuestra graduación',
    eventTitle: 'Ceremonia de Graduación',
    dateISO: '2026-11-27T14:30',
    venue: 'Complejo Educativo Cantón Guadalupe La Zorra',
    mapUrl: '', closingQuote: 'Los grandes sueños comienzan con pequeños pasos',
  },
  theme: { preset: 'navy-gold', primary: '#0B1B3F', accent: '#C9A24B', paper: '#FFFFFF', paperOpacity: 1 },
  agenda: {
    enabled: true, title: 'Agenda', colTime: 'Hora', colActivity: 'Actividad',
    items: [
      { time: '01:45 PM', activity: 'Punto de reunión' },
      { time: '02:30 PM', activity: 'Culto de Acción de Gracias' },
      { time: '03:30 PM', activity: 'Ceremonia de Graduación' },
      { time: '04:45 PM', activity: 'Cierre y sesión fotográfica' },
      { time: '05:00 PM', activity: 'Recepción' },
    ],
  },
  roster: {
    enabled: true, title: 'Nuestra promoción',
    names: [
      'AMAYA RIVERA, BRYAN EDENILSON',
      'AVENDAÑO BONILLA, WILSON ISAAC',
      'AYALA AGUILAR, CHERLIN VANESA',
      'BARAHONA LAÍNEZ, FRANCISCO ALBERTO',
      'BONILLA BONILLA, ÁNGEL RICARDO',
      'CAMPOS MENDOZA, DANIEL ALONSO',
      'CARRERO ORELLANA, SAID JOSSUÉ',
      'CUATRO FLORES, ANDERSON GEOVANY',
      'DÍAZ DÍAZ, CARLOS MAURICIO',
      'DURÁN VILLACORTA, VLADIMIR ADONAY',
      'ESCOBAR BELTRÁN, JOEL ANTONIO',
      'FLORES CRUZ, JEFERSON ADONAY',
      'FLORES RIVERA, ALISON BEATRIZ',
      'GONZÁLEZ MENDOZA, JACOBO ESAÚ',
      'GRANDE RODRÍGUEZ, CELESTE MARGARITA',
      'HURTADO ARGUETA, LUCIA EUNICE',
      'LÓPEZ GÓMEZ, JOSÉ DANIEL',
      'LÓPEZ PONCE, FRANCISCO ELÍAS',
      'LOZANO MEJÍA, JOSÉ LUIS',
      'MARAVILLA MENDOZA, NOÉ ISAAC',
      'MENDOZA FLORES, ANIBAL OSWALDO',
      'MENDOZA OSORIO, MÓNICA ELIZABETH',
      'MOLINA FLORES, ROSA MAILY',
      'ORELLANA AVENDAÑO, CÉSAR ARMANDO',
      'ORELLANA VILLACORTA, JOSÉ MAURICIO',
      'PALACIOS RAMÍREZ, RAMÓN ANTONIO',
      'VELÁSQUEZ RODRÍGUEZ, ANA MARÍA',
    ],
  },
  thanks: {
    enabled: true, title: 'Nuestros agradecimientos especiales a:',
    names: ['Jeovanny Pérez', 'Katherine Mejía', 'Nohemy Mejía', 'Alexander Flores'],
  },
  graduate: { name: '' },
  rsvp: { whatsapp: '', message: '¡Confirmo mi asistencia!' },
  music: { enabled: true, src: '/musica.mp3' },
  footerBrand: { enabled: false, text: 'PROMOCIÓN 2026' },
  timing: { autoAdvance: true, curtain: 1.6, page2At: 13.5, inviteStay: 9.5, agendaStay: 7, rosterStay: 8.5, thanksStay: 7, sweepAfter: 2 },
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}
export function deepMerge<T>(base: T, over: unknown): T {
  if (!isObj(base) || !isObj(over)) return (over === undefined ? base : (over as T))
  const out: Record<string, unknown> = { ...base }
  for (const k of Object.keys(base)) out[k] = deepMerge((base as Record<string, unknown>)[k], over[k])
  return out as T
}

export function parseConfig(raw: unknown): CardConfig {
  const r = configSchema.safeParse(deepMerge(DEFAULT_CONFIG, raw))
  return r.success ? r.data : DEFAULT_CONFIG
}

export function encodeConfig(c: CardConfig): string {
  return LZ.compressToEncodedURIComponent(JSON.stringify(c))
}
export function decodeConfig(payload: string | null): CardConfig {
  if (!payload) return DEFAULT_CONFIG
  try {
    const json = LZ.decompressFromEncodedURIComponent(payload)
    return json ? parseConfig(JSON.parse(json)) : DEFAULT_CONFIG
  } catch {
    return DEFAULT_CONFIG
  }
}

/** Solo permite http(s) o rutas relativas (evita javascript: y similares). */
export function safeUrl(u: string): string {
  const t = u.trim()
  return /^(https?:\/\/|\/|\.\/)/i.test(t) ? t : ''
}

/** Color de fondo de las páginas con su opacidad aplicada sobre blanco (resultado opaco, p. ej. #F5D0C9 al 50 % → #FAE8E4). */
export function paperColor(hexColor: string, opacity: number): string {
  const n = parseInt(hexColor.slice(1), 16)
  const mix = (c: number) => Math.round(c * opacity + 255 * (1 - opacity))
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(mix)
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}
