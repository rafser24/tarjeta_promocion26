import { useEffect, useMemo, useState } from 'react'
import { Invitation } from './components/Invitation'
import { Editor } from './components/Editor'
import { decodeConfig } from './lib/config'

export function App() {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const f = () => setHash(location.hash)
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  const config = useMemo(() => decodeConfig(new URLSearchParams(location.search).get('c')), [])
  const guest = useMemo(() => (new URLSearchParams(location.search).get('para') ?? '').trim().slice(0, 60), [])
  if (hash.startsWith('#/editar')) return <Editor />
  return (
    <div className="stage"><Invitation config={config} guest={guest} /></div>
  )
}
