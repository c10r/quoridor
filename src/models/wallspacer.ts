import { Position } from './position'
import { Wall } from './wall'

export interface WallSpacer {
  position: Position
  temporaryWall: Wall | undefined
  walls: Wall[]
}
