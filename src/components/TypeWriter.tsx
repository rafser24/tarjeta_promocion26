import { useEffect, useState, type CSSProperties, type ElementType } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface Props {
  text: string
  delay?: number
  cps?: number
  active: boolean
  skip?: boolean
  className?: string
  style?: CSSProperties
  as?: ElementType
}

/** Escribe el texto letra a letra. El texto completo vive en el DOM (aria-label) y el espacio
 *  restante se reserva invisible para que el diseño no se mueva mientras se escribe. */
export function TypeWriter({ text, delay = 0, cps = 30, active, skip, className, style, as: Tag = 'span' }: Props) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!active) { setN(0); return }
    if (skip || reduce) { setN(text.length); return }
    let iv: number | undefined
    const to = window.setTimeout(() => {
      const t0 = performance.now()
      iv = window.setInterval(() => {
        const k = Math.min(text.length, Math.floor(((performance.now() - t0) / 1000) * cps) + 1)
        setN(k)
        if (k >= text.length) window.clearInterval(iv)
      }, 16)
    }, delay * 1000)
    return () => { window.clearTimeout(to); window.clearInterval(iv) }
  }, [active, skip, reduce, text, delay, cps])

  return (
    <Tag className={className} style={style} aria-label={text}>
      <span aria-hidden>
        {text.slice(0, n)}
        <span style={{ visibility: 'hidden' }}>{text.slice(n)}</span>
      </span>
    </Tag>
  )
}

export function makeSeq(start: number) {
  let t = start
  return (len: number, cps: number, gap = 0.22) => {
    const d = t
    t += len / cps + gap
    return d
  }
}

export function Reveal({ active, delay = 0, dur = 0.7, y = 10, scaleX, children, className, style }: {
  active: boolean; delay?: number; dur?: number; y?: number; scaleX?: boolean
  children: React.ReactNode; className?: string; style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  const from = scaleX ? { opacity: 0, scaleX: 0 } : { opacity: 0, y: reduce ? 0 : y }
  const to = scaleX ? { opacity: 1, scaleX: 1 } : { opacity: 1, y: 0 }
  return (
    <motion.div className={className} style={{ transformOrigin: 'center', ...style }} initial={from}
      animate={active ? to : from}
      transition={{ duration: reduce ? 0.2 : dur, delay: reduce ? 0 : delay, ease: [0.22, 0.61, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}
