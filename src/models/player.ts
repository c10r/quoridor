import { Position } from './position'

export enum PlayerColor {
  BLACK,
  BROWN,
  RED,
  CYAN,
}

export interface Player {
  name: string
  color: PlayerColor
  position?: Position
  walls: number
}
