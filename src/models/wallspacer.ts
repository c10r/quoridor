import { Player } from './player'
import { Position } from './position'
import { Wall } from './wall'

export interface WallSpacer {
  illegalWall: Wall | undefined
  players: Player[]
  position: Position
  temporaryWall: Wall | undefined
  turn: number
  walls: Wall[]
}
