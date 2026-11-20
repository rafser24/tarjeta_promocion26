// Contador de envíos. POST suma 1; GET ?key=CLAVE devuelve el total (solo con la clave).
// Variables: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (o KV_REST_API_URL / KV_REST_API_TOKEN) y STATS_KEY.
import { timingSafeEqual } from 'node:crypto'

const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
const COUNTER = 'tarjeta:envios'

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  })
  if (!r.ok) throw new Error('redis ' + r.status)
  return (await r.json()).result
}

function sameKey(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b))
  return x.length === y.length && timingSafeEqual(x, y)
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const configured = Boolean(URL_ && TOKEN)

  if (req.method === 'POST') {
    // si no hay base de datos conectada, la tarjeta sigue funcionando sin error
    if (configured) { try { await redis(['INCR', COUNTER]) } catch { /* se ignora */ } }
    return res.status(204).end()
  }

  if (req.method === 'GET') {
    const secret = process.env.STATS_KEY
    if (!secret) return res.status(503).json({ error: 'Falta la variable STATS_KEY' })
    const key = String(req.query?.key ?? '')
    if (!key || !sameKey(key, secret)) return res.status(401).json({ error: 'Clave incorrecta' })
    if (!configured) return res.status(503).json({ error: 'Base de datos no conectada' })
    try {
      const n = Number(await redis(['GET', COUNTER])) || 0
      return res.status(200).json({ count: n })
    } catch {
      return res.status(502).json({ error: 'No se pudo leer el contador' })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).end()
}
