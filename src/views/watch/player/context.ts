import { createContext } from 'react'
import { PlayerInstance } from './hooks/usePlayerInstance'

export const PlayerContext = createContext<PlayerInstance | undefined>(undefined)
