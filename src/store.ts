import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_CONFIG, parseConfig, type CardConfig } from './lib/config'

interface State {
  config: CardConfig
  restart: number
  update: (fn: (draft: CardConfig) => void) => void
  reset: () => void
  replay: () => void
}

export const useCard = create<State>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      restart: 0,
      update: (fn) => {
        const draft = structuredClone(get().config)
        fn(draft)
        set({ config: draft })
      },
      reset: () => set({ config: DEFAULT_CONFIG, restart: get().restart + 1 }),
      replay: () => set({ restart: get().restart + 1 }),
    }),
    {
      name: 'tarjeta-graduacion-v1',
      partialize: (s) => ({ config: s.config }),
      merge: (p, cur) => ({ ...cur, config: parseConfig((p as Partial<State>)?.config) }),
    },
  ),
)
