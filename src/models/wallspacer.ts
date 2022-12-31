import { Player } from './player'
import { Position } from './position'
import { Wall } from './wall'

export interface WallSpacer {
  players: Player[]
  position: Position
  temporaryWall: Wall | undefined
  turn: number
  walls: Wall[]
}
