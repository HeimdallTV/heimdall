import { createContext } from 'react'
import { PlayerInstance } from './hooks/usePlayer'

export const PlayerContext = createContext<PlayerInstance | undefined>(undefined)
