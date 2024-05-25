import { createContext } from 'react'
import type { PlayerInstance } from './hooks/usePlayerInstance'

export const PlayerContext = createContext<PlayerInstance | undefined>(undefined)
