import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { paperColor, safeUrl, type CardConfig } from '../lib/config'
import { dateParts, downloadIcs, googleCalendarUrl, parseDate } from '../lib/dates'
import { Cap, Divider, GoldDefs, LaurelBranch, NavyPaper, Sparkles, Watercolor } from './Art'
import { Reveal, TypeWriter, makeSeq } from './TypeWriter'
import logoUrl from '../assets/logo.webp'
import capUrl from '../assets/birrete.webp'

/* ============ helpers ============ */
function useSeen(ref: RefObject<HTMLElement>, root: RefObject<HTMLElement>) {
  const inView = useInView(ref, { root, amount: 0.55 })
  const [seen, setSeen] = useState(false)
  useEffect(() => { if (inView) setSeen(true) }, [inView])
  return seen
}

const caps: CSSProperties = { fontFamily: "'Cormorant SC', serif", letterSpacing: '.04em', fontWeight: 500 }
const script: CSSProperties = { fontFamily: "'Great Vibes', cursive", fontWeight: 400 }

/* ============ Portada / Cierre ============ */
function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <NavyPaper />
      {children}
    </div>
  )
}

function CoverContent({ text, active, hint, guest, logo, cps = 14 }: { text: string; active: boolean; hint?: string; guest?: string; logo?: boolean; cps?: number }) {
  return (
    <>
      {logo ? (
        <motion.div style={{ position: 'absolute', left: '50%', marginLeft: '-23cqw', top: 'calc(28% - 5cqw)', width: '46cqw' }}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
          <img src={logoUrl} alt="Escudo de la institución" width={380} draggable={false}
            style={{ display: 'block', width: '100%', height: 'auto', filter: 'drop-shadow(0 1.6cqw 2.4cqw rgba(0,0,0,.45))', pointerEvents: 'none' }} />
        </motion.div>
      ) : (
        <motion.div style={{ position: 'absolute', left: '18.5cqw', top: '28%', width: '63cqw' }}
          animate={{ y: [0, -4, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
          <Cap style={{ filter: 'drop-shadow(0 1.6cqw 2.4cqw rgba(0,0,0,.45))' }} />
        </motion.div>
      )}
      <TypeWriter as="div" text={text} active={active} cps={cps} delay={0.4}
        style={{ ...script, position: 'absolute', left: 0, right: 0, top: 'calc(28% + 52cqw)', textAlign: 'center', color: '#fff', fontSize: '7.4cqw' }} />
      {guest && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.9 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 'calc(28% + 67cqw)', textAlign: 'center', padding: '0 8cqw' }}>
          <div style={{ ...caps, fontSize: '3.1cqw', letterSpacing: '.28em', color: 'var(--gold-300)' }}>PARA</div>
          <div style={{ ...script, fontSize: '7cqw', lineHeight: 1.2, color: '#fff', textWrap: 'balance' } as CSSProperties}>{guest}</div>
        </motion.div>
      )}
      {hint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.45, 1] }}
          transition={{ delay: 2, duration: 2.6, repeat: Infinity, repeatDelay: 0.4 }}
          style={{ position: 'absolute', bottom: '9cqw', left: 0, right: 0, textAlign: 'center', color: 'var(--gold-300)', ...caps, fontSize: '3.6cqw', letterSpacing: '.18em' }}>
          {hint.toUpperCase()}
        </motion.div>
      )}
    </>
  )
}

/** Elige el mayor tamaño de letra (en cqw) con el que el texto cabe en el ancho y alto disponibles. */
function fitScript(text: string, o = { maxW: 86, maxLines: 3, maxH: 36, min: 5.5, max: 10.5, k: 0.42, lh: 1.18 }) {
  const words = text.split(/\s+/).filter(Boolean)
  for (let fs = o.max; fs >= o.min; fs -= 0.25) {
    const cap = o.maxW / (o.k * fs) // caracteres por línea
    let lines = 1
    let cur = 0
    for (const w of words) {
      const need = cur === 0 ? w.length : cur + 1 + w.length
      if (need <= cap) cur = need
      else { lines++; cur = w.length }
    }
    if (lines <= o.maxLines && lines * fs * o.lh <= o.maxH) return fs
  }
  return o.min
}

/* ============ Página 1 ============ */
function PromoPage({ c, active, start }: { c: CardConfig; active: boolean; start: number }) {
  const [skip, setSkip] = useState(false)
  const d = (x: number) => (skip ? 0 : x)
  const at = makeSeq(start)
  const { promo } = c
  const tLabel = at(promo.label.length, 14)
  const tYear = at(promo.year.length, 8, 0.15)
  const tMotto = at(promo.motto.length, 22)
  const tDiv1 = at(0, 1, 0.1)
  const tSchool = at(promo.school.length, 42)
  const tDiv2 = at(0, 1, 0.1)
  const tMsg = at(promo.message.length, 62)
  return (
    <section className="page" onPointerDown={() => setSkip(true)}>
      <Reveal active={active} dur={1} y={0} className="wc-top"><Watercolor /></Reveal>
      <div className="col" style={{ paddingTop: '23cqw' }}>
        <Reveal active={active} dur={0.9} delay={d(0.2)} y={6} style={{ width: '34cqw' }}>
          <img src={capUrl} alt="Birrete y diploma" width={900} draggable={false}
            style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 1cqw 1.6cqw rgba(0,0,0,.25))', pointerEvents: 'none' }} />
        </Reveal>
        {promo.label && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.6cqw', width: '100%', marginTop: '3cqw' }}>
            {[false, true].map((flip) => (
              <motion.div key={String(flip)} aria-hidden
                initial={{ clipPath: 'inset(100% -20% 0 -20%)', opacity: 0 }}
                animate={active ? { clipPath: 'inset(-10% -20% -10% -20%)', opacity: 1 } : { clipPath: 'inset(100% -20% 0 -20%)', opacity: 0 }}
                transition={{ duration: skip ? 0.1 : 1, delay: d(tLabel + 0.15), ease: 'easeOut' }}
                style={{ width: promo.label.length > 11 ? '9cqw' : '12.5cqw', flex: 'none', margin: '-4cqw 0', order: flip ? 3 : 1 }}>
                <LaurelBranch flip={flip} />
              </motion.div>
            ))}
            <TypeWriter as="div" text={promo.label} active={active} delay={d(tLabel)} cps={14}
              style={{ ...caps, fontSize: promo.label.length > 11 ? '7.4cqw' : '10cqw', lineHeight: 1.1, textAlign: 'center', order: 2 }} />
          </div>
        )}
        {promo.year && (
          <TypeWriter as="div" text={promo.year} active={active} delay={d(tYear)} cps={8}
            style={{ ...caps, fontSize: '11.4cqw', lineHeight: 1.05, marginTop: '2.4cqw', fontWeight: 500 }} />
        )}
        {promo.motto && (
          <TypeWriter as="div" text={`“${promo.motto}”`} active={active} delay={d(tMotto)} cps={22}
            style={{ ...script, fontSize: '8.4cqw', lineHeight: 1.2, marginTop: '1cqw', textAlign: 'center' }} />
        )}
        {promo.school && (
          <>
            <Reveal active={active} delay={d(tDiv1)} scaleX style={{ width: '38cqw', marginTop: '3.4cqw' }}><Divider /></Reveal>
            <TypeWriter as="div" text={`“${promo.school}”`} active={active} delay={d(tSchool)} cps={42}
              style={{ ...script, fontSize: `${fitScript(`“${promo.school}”`)}cqw`, lineHeight: 1.18, textAlign: 'center',
                margin: '3.4cqw 0', maxWidth: '88cqw', textWrap: 'balance' } as CSSProperties} />
            <Reveal active={active} delay={d(tDiv2)} scaleX style={{ width: '38cqw' }}><Divider /></Reveal>
          </>
        )}
        {promo.message && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '3.4cqw', gap: '1cqw' }}>
            <Reveal active={active} delay={d(tMsg)} style={{ width: '11cqw', flex: 'none' }}><Sparkles /></Reveal>
            <TypeWriter as="div" text={`“${promo.message}”`} active={active} delay={d(tMsg)} cps={62}
              style={{ fontSize: '4.2cqw', lineHeight: 1.32, textAlign: 'center', width: '64cqw', textWrap: 'balance' } as CSSProperties} />
            <Reveal active={active} delay={d(tMsg)} style={{ width: '11cqw', flex: 'none' }}><Sparkles flip /></Reveal>
          </div>
        )}
      </div>
    </section>
  )
}

/* ============ Página 2 ============ */
function GoldLine({ active, delay, origin }: { active: boolean; delay: number; origin: 'left' | 'right' }) {
  return (
    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: active ? 1 : 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      style={{ height: '.55cqw', background: 'var(--gold-500)', transformOrigin: origin, width: '100%' }} />
  )
}

function DateBox({ active, delay, origin, children }: { active: boolean; delay: number; origin: 'left' | 'right'; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.4cqw', alignItems: 'stretch' }}>
      <GoldLine active={active} delay={delay} origin={origin} />
      <div style={{ textAlign: 'center', fontSize: '4.4cqw', lineHeight: 1.2 }}>{children}</div>
      <GoldLine active={active} delay={delay + 0.15} origin={origin} />
    </div>
  )
}

function InvitePage({ c, active }: { c: CardConfig; active: boolean }) {
  const [skip, setSkip] = useState(false)
  const d = (x: number) => (skip ? 0 : x)
  const at = makeSeq(0.5)
  const { invite } = c
  const p = dateParts(invite.dateISO)
  const tIntro = at(invite.intro.length, 62)
  const tDiv1 = at(0, 1, 0.1)
  const tTitle = at(invite.eventTitle.length, 26)
  const tDiv2 = at(0, 1, 0.1)
  const tWeek = at(p.weekday.length, 16)
  const tRow = at(10, 14, 0.4)
  const tYear = at(4, 10)
  const tVenue = at(invite.venue.length, 60)
  const tDiv3 = at(0, 1, 0.1)
  const tQuote = at(invite.closingQuote.length, 55)
  const dateOk = !!p.day
  return (
    <section className="page" onPointerDown={() => setSkip(true)}>
      <div className="col" style={{ paddingTop: '12cqw', justifyContent: 'flex-start', paddingBottom: '36cqw' }}>
        {invite.intro && (
          <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', justifyContent: 'center', gap: '1cqw' }}>
            <Reveal active={active} delay={d(0.1)} style={{ width: '12cqw', flex: 'none' }}><Sparkles /></Reveal>
            <TypeWriter as="div" text={invite.intro} active={active} delay={d(tIntro)} cps={62}
              style={{ fontSize: '3.9cqw', lineHeight: 1.38, textAlign: 'center', width: '62cqw', marginTop: '4cqw', textWrap: 'balance' } as CSSProperties} />
            <Reveal active={active} delay={d(0.1)} style={{ width: '12cqw', flex: 'none' }}><Sparkles flip /></Reveal>
          </div>
        )}
        {invite.eventTitle && (
          <>
            <Reveal active={active} delay={d(tDiv1)} scaleX style={{ width: '38cqw', marginTop: '2cqw' }}><Divider /></Reveal>
            <TypeWriter as="div" text={invite.eventTitle} active={active} delay={d(tTitle)} cps={26}
              style={{ ...script, fontSize: '8.6cqw', lineHeight: 1.2, margin: '3.4cqw 0', textAlign: 'center' }} />
            <Reveal active={active} delay={d(tDiv2)} scaleX style={{ width: '38cqw' }}><Divider /></Reveal>
          </>
        )}
        {dateOk && (
          <>
            <TypeWriter as="div" text={p.weekday} active={active} delay={d(tWeek)} cps={16}
              style={{ ...caps, fontSize: '6.6cqw', marginTop: '5cqw', lineHeight: 1.1 }} />
            <div style={{ display: 'flex', alignItems: 'center', width: '86cqw', marginTop: '2.4cqw', gap: '2.6cqw' }}>
              <DateBox active={active} delay={d(tRow)} origin="right">
                <Reveal active={active} delay={d(tRow + 0.3)} y={0}>{p.time}</Reveal>
              </DateBox>
              <Reveal active={active} delay={d(tRow + 0.2)} y={4} style={{ ...caps, fontSize: '13cqw', lineHeight: 1 }}>{p.day}</Reveal>
              <DateBox active={active} delay={d(tRow)} origin="left">
                <Reveal active={active} delay={d(tRow + 0.3)} y={0}><span style={caps}>{p.month}</span></Reveal>
              </DateBox>
            </div>
            <Reveal active={active} delay={d(tYear)} y={4} style={{ ...caps, fontSize: '5.6cqw', marginTop: '3cqw' }}>{p.year}</Reveal>
          </>
        )}
        {invite.venue && (
          <TypeWriter as="div" text={invite.venue.toUpperCase()} active={active} delay={d(tVenue)} cps={60}
            style={{ ...caps, fontSize: invite.venue.length > 30 ? '4.5cqw' : '5.6cqw', lineHeight: 1.25, textAlign: 'center',
              marginTop: '6cqw', maxWidth: '78cqw', textWrap: 'balance' } as CSSProperties} />
        )}
        {invite.closingQuote && (
          <>
            <Reveal active={active} delay={d(tDiv3)} scaleX style={{ width: '38cqw', marginTop: '5cqw' }}><Divider /></Reveal>
            <TypeWriter as="div" text={`“${invite.closingQuote}”`} active={active} delay={d(tQuote)} cps={55}
              style={{ fontSize: '4.2cqw', lineHeight: 1.3, textAlign: 'center', color: 'var(--ink-soft)', maxWidth: '66cqw', marginTop: '4.4cqw', textWrap: 'balance' } as CSSProperties} />
          </>
        )}
      </div>
      <Reveal active={active} dur={1.1} delay={d(0.4)} y={0} className="wc-bottom"><Watercolor flip /></Reveal>
    </section>
  )
}

/* ============ Página: agenda ============ */
function AgendaPage({ c, active }: { c: CardConfig; active: boolean }) {
  const [skip, setSkip] = useState(false)
  const d = (x: number) => (skip ? 0 : x)
  const reduce = useReducedMotion()
  const { agenda } = c
  const n = agenda.items.length
  const cols = '30cqw 9cqw 1fr'
  return (
    <section className="page" onPointerDown={() => setSkip(true)}>
      <Reveal active={active} dur={1} y={0} className="wc-top"><Watercolor /></Reveal>
      <div className="col" style={{ paddingTop: '14cqw' }}>
        {agenda.title && (
          <TypeWriter as="div" text={agenda.title} active={active} delay={d(0.3)} cps={12}
            style={{ ...script, fontSize: '13cqw', lineHeight: 1.1, textAlign: 'center' }} />
        )}
        <Reveal active={active} delay={d(0.8)} scaleX style={{ width: '38cqw', marginTop: '2cqw' }}><Divider /></Reveal>
        <div style={{ width: '88cqw', marginTop: '8cqw' }}>
          {(agenda.colTime || agenda.colActivity) && (
            <Reveal active={active} delay={d(1.1)} y={4}>
              <div style={{ display: 'grid', gridTemplateColumns: cols, ...caps, fontSize: '3.4cqw', letterSpacing: '.24em', color: 'var(--gold-500)', paddingBottom: '2.4cqw' }}>
                <span style={{ textAlign: 'right' }}>{agenda.colTime.toUpperCase()}</span>
                <span />
                <span>{agenda.colActivity.toUpperCase()}</span>
              </div>
              <div style={{ height: '.3cqw', background: 'var(--gold-500)', opacity: 0.8 }} />
            </Reveal>
          )}
          {agenda.items.map((it, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 8 }}
              transition={{ duration: reduce ? 0.2 : 0.6, delay: reduce ? 0 : d(1.6 + i * 0.5), ease: 'easeOut' }}
              style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', minHeight: '17cqw' }}>
              <div style={{ ...caps, fontSize: '5.2cqw', textAlign: 'right', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{it.time}</div>
              <div style={{ position: 'relative', alignSelf: 'stretch', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '50%', width: '.35cqw', marginLeft: '-.18cqw', background: 'var(--gold-500)', opacity: 0.7,
                  top: i === 0 ? '50%' : 0, bottom: i === n - 1 ? '50%' : 0 }} />
                <div style={{ position: 'relative', width: '3cqw', height: '3cqw', borderRadius: '50%', background: 'var(--paper)', border: '.5cqw solid var(--gold-500)' }} />
              </div>
              <div style={{ fontSize: '5.2cqw', fontWeight: 600, lineHeight: 1.18, textWrap: 'balance', paddingRight: '2cqw' } as CSSProperties}>{it.activity}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============ Página: agradecimientos ============ */
function ThanksPage({ c, active }: { c: CardConfig; active: boolean }) {
  const [skip, setSkip] = useState(false)
  const d = (x: number) => (skip ? 0 : x)
  const reduce = useReducedMotion()
  const { thanks } = c
  const n = thanks.names.length
  const tFs = fitScript(thanks.title, { maxW: 80, maxLines: 4, maxH: 44, min: 6, max: 10.5, k: 0.42, lh: 1.18 })
  const longest = Math.max(1, ...thanks.names.map((x) => x.length))
  const nFs = Math.min(7.4, 80 / (longest * 0.62)) // las mayúsculas ocupan ~0.62 em por letra
  const tTitle = 0.3
  const tNames = 0.3 + thanks.title.length / 24 + 0.6
  return (
    <section className="page" onPointerDown={() => setSkip(true)}>
      <Reveal active={active} dur={1} y={0} className="wc-top"><Watercolor /></Reveal>
      <div className="col" style={{ paddingTop: '16cqw' }}>
        {thanks.title && (
          <TypeWriter as="div" text={thanks.title} active={active} delay={d(tTitle)} cps={24}
            style={{ ...script, fontSize: `${tFs}cqw`, lineHeight: 1.18, textAlign: 'center', maxWidth: '84cqw', textWrap: 'balance' } as CSSProperties} />
        )}
        <Reveal active={active} delay={d(tNames - 0.3)} scaleX style={{ width: '38cqw', marginTop: '5cqw' }}><Divider /></Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '7cqw', width: '100%' }}>
          {thanks.names.map((name, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 8 }}
              transition={{ duration: reduce ? 0.2 : 0.7, delay: reduce ? 0 : d(tNames + i * 0.7), ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div style={{ ...caps, fontSize: `${nFs}cqw`, lineHeight: 1.15, textAlign: 'center', letterSpacing: '.08em' }}>{name}</div>
              {i < n - 1 && (
                <svg viewBox="0 0 20 20" aria-hidden style={{ width: '4cqw', margin: '5.4cqw 0' }}>
                  <path d="M10 1 Q10 10 19 10 Q10 10 10 19 Q10 10 1 10 Q10 10 10 1Z" fill="url(#gold)" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============ Página 3: nómina ============ */
function RosterPage({ c, active }: { c: CardConfig; active: boolean }) {
  const [skip, setSkip] = useState(false)
  const d = (x: number) => (skip ? 0 : x)
  const reduce = useReducedMotion()
  const { roster } = c
  const n = roster.names.length
  const regionH = 124 // cqw disponibles para la lista
  const fs = Math.min(4, (regionH / n) * 0.66)
  return (
    <section className="page" onPointerDown={() => setSkip(true)}>
      <div className="col" style={{ justifyContent: 'flex-start', paddingTop: '7cqw' }}>
        {roster.title && (
          <TypeWriter as="div" text={roster.title} active={active} delay={d(0.3)} cps={18}
            style={{ ...script, fontSize: '9cqw', lineHeight: 1.15, textAlign: 'center' }} />
        )}
        <Reveal active={active} delay={d(0.9)} scaleX style={{ width: '38cqw', marginTop: '1.6cqw' }}><Divider /></Reveal>
        <ol style={{ listStyle: 'none', margin: '4cqw 0 0', padding: 0, width: '86cqw', height: `${regionH}cqw`,
          display: 'grid', gridTemplateRows: `repeat(${n}, 1fr)` }}>
          {roster.names.map((full, i) => {
            const k = full.indexOf(',')
            const last = k >= 0 ? full.slice(0, k + 1) : full
            const first = k >= 0 ? full.slice(k + 1).trim() : ''
            return (
              <motion.li key={i} initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 6 }}
                transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : d(1.2 + i * 0.08), ease: 'easeOut' }}
                style={{ display: 'flex', alignItems: 'center', gap: '2.4cqw', fontSize: `${fs}cqw`, lineHeight: 1, ...caps,
                  borderBottom: i < n - 1 ? '.2cqw solid color-mix(in srgb, var(--gold-500) 35%, transparent)' : 'none' }}>
                <span style={{ width: '6cqw', textAlign: 'right', color: 'var(--gold-500)', fontVariantNumeric: 'tabular-nums', flex: 'none' }}>{i + 1}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontWeight: 500 }}>{last}</span>
                  {first && <span style={{ fontWeight: 400, color: 'color-mix(in srgb, var(--navy) 78%, var(--paper))' }}> {first}</span>}
                </span>
              </motion.li>
            )
          })}
        </ol>
      </div>
      <Reveal active={active} dur={1.1} delay={d(0.4)} y={0} className="wc-bottom"><Watercolor flip /></Reveal>
    </section>
  )
}

/* ============ Cierre con acciones ============ */
function Countdown({ iso }: { iso: string }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 30_000); return () => clearInterval(i) }, [])
  const t = parseDate(iso)
  if (!t || +t <= now) return null
  const ms = +t - now
  const cells: [number, string][] = [
    [Math.floor(ms / 86_400_000), 'días'],
    [Math.floor(ms / 3_600_000) % 24, 'horas'],
    [Math.floor(ms / 60_000) % 60, 'min'],
  ]
  return (
    <div style={{ display: 'flex', gap: '5cqw', justifyContent: 'center' }} role="timer" aria-label="Cuenta regresiva">
      {cells.map(([n, l]) => (
        <div key={l} style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ ...caps, fontSize: '8cqw', lineHeight: 1 }}>{String(n).padStart(2, '0')}</div>
          <div style={{ ...caps, fontSize: '3cqw', color: 'var(--gold-300)', letterSpacing: '.16em', marginTop: '1cqw' }}>{l.toUpperCase()}</div>
        </div>
      ))}
    </div>
  )
}

const btn: CSSProperties = {
  ...caps, fontSize: '3.4cqw', letterSpacing: '.12em', color: 'var(--gold-300)', background: 'transparent',
  border: '1px solid var(--gold-500)', borderRadius: 999, padding: '2.4cqw 4.6cqw', minHeight: 44, cursor: 'pointer',
  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}

/* ============ Personalizar y enviar (cada alumno genera su enlace) ============ */
function SendSheet({ c, onClose }: { c: CardConfig; onClose: () => void }) {
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const clean = name.trim().slice(0, 60)
  const link = () => {
    const u = new URL(location.href)
    u.hash = ''
    u.searchParams.set('para', clean)
    return u.toString()
  }
  const message = () => `Hola ${clean} 🎓\n${c.invite.intro}.\nAbre tu invitación 👇\n${link()}`
  const copy = async () => {
    try { await navigator.clipboard.writeText(link()); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* copiar manualmente */ }
  }
  const primary: CSSProperties = { ...btn, background: 'var(--gold-500)', color: 'var(--navy)', borderColor: 'var(--gold-500)', fontWeight: 600 }
  return (
    <div role="dialog" aria-modal="true" aria-label="Personalizar y enviar"
      style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(7,18,43,.985)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '4cqw', padding: '8cqw', textAlign: 'center' }}>
      <button onClick={onClose} aria-label="Cerrar"
        style={{ position: 'absolute', top: '3cqw', right: '3cqw', width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--gold-500)',
          background: 'transparent', color: 'var(--gold-300)', fontSize: 18, cursor: 'pointer' }}>✕</button>
      <div style={{ ...script, fontSize: '9cqw', color: '#fff', lineHeight: 1.15 }}>¿Para quién es?</div>
      <div style={{ color: 'var(--gold-300)', fontSize: '3.8cqw', lineHeight: 1.35, maxWidth: '70cqw' }}>
        Escribe el nombre de la persona o familia. Su portada dirá su nombre.
      </div>
      <input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="Ej.: Familia Pérez" autoFocus
        aria-label="Nombre del invitado"
        style={{ width: '78cqw', fontSize: 18, fontFamily: "'Cormorant Garamond', serif", textAlign: 'center', padding: '12px 14px',
          borderRadius: 10, border: '1px solid var(--gold-500)', background: 'rgba(255,255,255,.08)', color: '#fff', outline: 'none' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4cqw', alignItems: 'center' }}>
        {clean ? (
          <a style={primary} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(message())}`}>ENVIAR POR WHATSAPP</a>
        ) : (
          <span style={{ ...primary, opacity: 0.4 }} aria-disabled>ENVIAR POR WHATSAPP</span>
        )}
        <button style={{ ...btn, opacity: clean ? 1 : 0.4 }} disabled={!clean} onClick={copy}>{copied ? '¡ENLACE COPIADO!' : 'COPIAR ENLACE'}</button>
      </div>
    </div>
  )
}

/** Birrete con diploma de la pantalla final; se acomoda al alto disponible. */
function Hero() {
  return (
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ height: '100%', width: '100%', maxWidth: '56cqw', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* resplandor suave para que el birrete oscuro se distinga sobre el azul */}
      <div aria-hidden style={{ position: 'absolute', inset: '-6% -10%', background: 'radial-gradient(closest-side, rgba(255,255,255,.2), rgba(255,255,255,.07) 60%, transparent)', pointerEvents: 'none' }} />
      <img src={capUrl} alt="Birrete y diploma" width={900} draggable={false}
        style={{ position: 'relative', maxHeight: '100%', maxWidth: '100%', width: 'auto', height: 'auto', objectFit: 'contain',
          filter: 'drop-shadow(0 1.6cqw 2.4cqw rgba(0,0,0,.45))', pointerEvents: 'none' }} />
    </motion.div>
  )
}

function ClosingPage({ c, active, onReplay, guest }: { c: CardConfig; active: boolean; onReplay: () => void; guest?: string }) {
  const [sending, setSending] = useState(false)
  const wa = c.rsvp.whatsapp.replace(/\D/g, '')
  const map = safeUrl(c.invite.mapUrl)
  const gcal = googleCalendarUrl(c)
  // botones más compactos para que todo quepa en pantallas bajas
  const bs: CSSProperties = { ...btn, fontSize: '3.2cqw', padding: '1.8cqw 4cqw', minHeight: 40 }
  return (
    <section className="page" style={{ background: 'var(--navy)' }}>
      <Backdrop>
        {/* columna: el escudo toma el espacio sobrante; el texto y los botones nunca se superponen */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8cqw 5cqw 5cqw' }}>
          <div style={{ flex: '1 1 0', minHeight: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Hero />
          </div>
          <TypeWriter as="div" text={c.cover.closing} active={active} cps={12} delay={0.4}
            style={{ ...script, textAlign: 'center', color: '#fff', fontSize: '7.4cqw', lineHeight: 1.15, marginTop: '5cqw', flex: 'none' }} />
          {c.graduate.name && (
            <Reveal active={active} delay={2} style={{ textAlign: 'center', color: 'var(--gold-300)', ...caps, fontSize: '4cqw', letterSpacing: '.14em', marginTop: '2cqw', flex: 'none' }}>
              {c.graduate.name.toUpperCase()}
            </Reveal>
          )}
          <Reveal active={active} delay={2.4} style={{ display: 'flex', flexDirection: 'column', gap: '3.6cqw', alignItems: 'center', marginTop: '6.5cqw', width: '100%', flex: 'none' }}>
            <Countdown iso={c.invite.dateISO} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2cqw', justifyContent: 'center' }}>
              {!guest && (
                <button style={{ ...bs, background: 'var(--gold-500)', color: 'var(--navy)', fontWeight: 600 }} onClick={() => setSending(true)}>
                  PERSONALIZAR Y ENVIAR
                </button>
              )}
              {gcal && <button style={bs} onClick={() => downloadIcs(c)}>AGREGAR AL CALENDARIO</button>}
              {map && <a style={bs} href={map} target="_blank" rel="noopener noreferrer">CÓMO LLEGAR</a>}
              {wa && (
                <a style={bs} target="_blank" rel="noopener noreferrer"
                  href={`https://wa.me/${wa}?text=${encodeURIComponent(c.rsvp.message)}`}>CONFIRMAR ASISTENCIA</a>
              )}
              <button style={{ ...bs, borderColor: 'transparent', opacity: 0.8 }} onClick={onReplay}>↺ VOLVER A VER</button>
            </div>
          </Reveal>
        </div>
      </Backdrop>
      {sending && <SendSheet c={c} onClose={() => setSending(false)} />}
    </section>
  )
}

function BrandPage({ text }: { text: string }) {
  return (
    <section className="page" style={{ background: '#F0ECE6', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: '9cqw', color: '#1d1a16', textAlign: 'center', letterSpacing: '.06em',
        borderBottom: '1px solid #1d1a16', paddingBottom: '1.6cqw' }}>{text}</div>
    </section>
  )
}

/* ============ Barrido dorado (cierre → pantalla final) ============ */
function GoldSweep({ onCover, onDone }: { onCover: () => void; onDone: () => void }) {
  const cover = useRef(onCover)
  cover.current = onCover
  useEffect(() => {
    const t = window.setTimeout(() => cover.current(), 820)
    return () => window.clearTimeout(t)
  }, [])
  const cols = ['var(--gold-500)', 'color-mix(in srgb, var(--gold-500) 88%, #8a4b00)', 'color-mix(in srgb, var(--gold-500) 88%, white)']
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 40, pointerEvents: 'none', overflow: 'hidden' }}>
      {cols.map((bg, i) => (
        <motion.div key={i} style={{ position: 'absolute', inset: 0, background: bg }}
          initial={{ x: '-101%' }} animate={{ x: ['-101%', '0%', '0%', '101%'] }}
          transition={{ duration: 1.4, delay: i * 0.08, times: [0, 0.42, 0.58, 1], ease: 'easeInOut' }}
          onAnimationComplete={i === cols.length - 1 ? onDone : undefined} />
      ))}
    </div>
  )
}

/* ============ Tarjeta ============ */
function Inner({ config, guest, onReplay }: { config: CardConfig; guest?: string; onReplay: () => void }) {
  const reduce = useReducedMotion()
  const [opened, setOpened] = useState(false)
  const [done, setDone] = useState(false)
  const [idx, setIdx] = useState(0)
  const [muted, setMuted] = useState(true)
  const [sweeping, setSweeping] = useState(false)
  const userTook = useRef(false)
  const scroller = useRef<HTMLDivElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const refA = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const refT = useRef<HTMLDivElement>(null)
  const ref4 = useRef<HTMLDivElement>(null)
  const seen2 = useSeen(ref2 as RefObject<HTMLElement>, scroller as RefObject<HTMLElement>)
  const seenA = useSeen(refA as RefObject<HTMLElement>, scroller as RefObject<HTMLElement>)
  const seen3 = useSeen(ref3 as RefObject<HTMLElement>, scroller as RefObject<HTMLElement>)
  const seenT = useSeen(refT as RefObject<HTMLElement>, scroller as RefObject<HTMLElement>)
  const seen4 = useSeen(ref4 as RefObject<HTMLElement>, scroller as RefObject<HTMLElement>)
  const { timing } = config
  const music = safeUrl(config.music.src)
  const rosterOn = config.roster.enabled && config.roster.names.length > 0
  const agendaOn = config.agenda.enabled && config.agenda.items.length > 0
  const thanksOn = config.thanks.enabled && config.thanks.names.length > 0
  const sections = 3 + (agendaOn ? 1 : 0) + (rosterOn ? 1 : 0) + (thanksOn ? 1 : 0) + (config.footerBrand.enabled ? 1 : 0)

  const open = () => {
    if (opened) return
    setOpened(true)
    if (config.music.enabled && music && audio.current) {
      audio.current.volume = 0.35
      audio.current.play().then(() => setMuted(false)).catch(() => {})
    }
  }

  // avance automático (como en el video); se cancela si el usuario toma el control
  useEffect(() => {
    const sc = scroller.current
    if (!opened || !timing.autoAdvance || !sc) return
    const go = (i: number) => sc.scrollTo({ top: i * sc.clientHeight, behavior: reduce ? 'auto' : 'smooth' })
    // páginas tras la invitación: agenda y nómina (opcionales) y al final el cierre
    const stays = [timing.inviteStay, ...(agendaOn ? [timing.agendaStay] : []), ...(rosterOn ? [timing.rosterStay] : []), ...(thanksOn ? [timing.thanksStay] : [])]
    let t = timing.page2At
    const timers = [window.setTimeout(() => go(1), t * 1000)]
    stays.forEach((st, k) => { t += st; timers.push(window.setTimeout(() => go(k + 2), t * 1000)) })
    const stop = () => { userTook.current = true; timers.forEach((x) => window.clearTimeout(x)) }
    const ev = ['wheel', 'touchmove', 'keydown'] as const
    ev.forEach((e) => sc.addEventListener(e, stop, { passive: true }))
    return () => { stop(); ev.forEach((e) => sc.removeEventListener(e, stop)) }
  }, [opened, timing.autoAdvance, timing.page2At, timing.inviteStay, timing.agendaStay, timing.rosterStay, timing.thanksStay, agendaOn, rosterOn, thanksOn, reduce])

  // barrido dorado hacia la pantalla final (solo si hay pantalla final y el usuario no tomó el control)
  useEffect(() => {
    if (!opened || !timing.autoAdvance || !config.footerBrand.enabled || !seen4) return
    const t = window.setTimeout(() => { if (userTook.current) return; if (reduce) toFinal(); else setSweeping(true) }, timing.sweepAfter * 1000)
    return () => window.clearTimeout(t)
  }, [opened, timing.autoAdvance, timing.sweepAfter, config.footerBrand.enabled, seen4, reduce])

  const toFinal = () => {
    const sc = scroller.current
    if (sc) sc.scrollTo({ top: (sections - 1) * sc.clientHeight, behavior: 'auto' })
  }

  const toggleMusic = () => {
    const a = audio.current
    if (!a) return
    if (a.paused) { a.play().then(() => setMuted(false)).catch(() => {}) } else { a.pause(); setMuted(true) }
  }

  return (
    <>
      <div ref={scroller} className="scroller" style={{ overflowY: opened ? 'auto' : 'hidden' }}
        onScroll={(e) => {
          const el = e.currentTarget
          const p = el.scrollTop / el.clientHeight
          setIdx(Math.round(p))
          // fundido entre páginas mientras se desplaza
          if (!reduce) Array.from(el.children).forEach((c, i) => { (c as HTMLElement).style.opacity = String(Math.max(0, 1 - Math.abs(p - i) * 0.9)) })
        }}>
        <PromoPage c={config} active={opened} start={reduce ? 0 : timing.curtain - 0.2} />
        <div ref={ref2} className="page-wrap"><InvitePage c={config} active={seen2} /></div>
        {agendaOn && <div ref={refA} className="page-wrap"><AgendaPage c={config} active={seenA} /></div>}
        {rosterOn && <div ref={ref3} className="page-wrap"><RosterPage c={config} active={seen3} /></div>}
        {thanksOn && <div ref={refT} className="page-wrap"><ThanksPage c={config} active={seenT} /></div>}
        <div ref={ref4} className="page-wrap"><ClosingPage c={config} active={seen4} onReplay={onReplay} guest={guest} /></div>
        {config.footerBrand.enabled && <BrandPage text={config.footerBrand.text} />}
      </div>

      {sweeping && <GoldSweep onCover={toFinal} onDone={() => setSweeping(false)} />}

      {/* indicador de progreso */}
      {opened && (
        <div className="dots" aria-hidden>
          {Array.from({ length: sections }, (_, i) => (
            <span key={i} style={{ background: i === idx ? 'var(--gold-500)' : 'transparent' }} />
          ))}
        </div>
      )}

      {music && (
        <>
          <audio ref={audio} src={music} loop preload="none" />
          {opened && (
            <button className="music" onClick={toggleMusic} aria-label={muted ? 'Activar música' : 'Silenciar música'}>
              {muted ? '♪̸' : '♪'}
            </button>
          )}
        </>
      )}

      {/* portada: panel que se desliza */}
      {!done && (
        <motion.div role="button" tabIndex={0} aria-label={config.cover.tapHint}
          onClick={open} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
          onPanEnd={(_, i) => { if (i.offset.x < -40) open() }}
          initial={false}
          animate={reduce ? { opacity: opened ? 0 : 1 } : { x: opened ? '104%' : '0%' }}
          transition={{ duration: reduce ? 0.4 : timing.curtain, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => { if (opened) setDone(true) }}
          style={{ position: 'absolute', inset: 0, zIndex: 20, cursor: opened ? 'default' : 'pointer', touchAction: 'pan-y',
            boxShadow: opened ? '-3cqw 0 6cqw rgba(0,0,0,.45)' : 'none', pointerEvents: opened ? 'none' : 'auto' }}>
          <Backdrop><CoverContent text={config.cover.tagline} active hint={config.cover.tapHint} guest={guest} logo={config.cover.showLogo} /></Backdrop>
        </motion.div>
      )}
    </>
  )
}

export function Invitation({ config, restart = 0, guest }: { config: CardConfig; restart?: number; guest?: string }) {
  const [local, setLocal] = useState(0)
  const paper = paperColor(config.theme.paper, config.theme.paperOpacity)
  const style = {
    '--navy': config.theme.primary,
    '--accent': config.theme.accent,
    '--gold-500': config.theme.accent,
    '--gold-300': `color-mix(in srgb, ${config.theme.accent} 55%, white)`,
    '--gold-700': `color-mix(in srgb, ${config.theme.accent} 62%, black)`,
    '--paper': paper,
    '--ink-soft': `color-mix(in srgb, ${config.theme.primary} 62%, ${paper})`,
  } as CSSProperties
  return (
    <div className="card" style={style}>
      <GoldDefs />
      <Inner key={`${restart}-${local}`} config={config} guest={guest} onReplay={() => setLocal((n) => n + 1)} />
    </div>
  )
}
