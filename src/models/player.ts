import { Position } from './position'

export enum PlayerColor {
  BLACK,
  BROWN,
  RED,
  CYAN,
}

export interface Player {
  color: PlayerColor
  isComputer: boolean
  name: string
  position?: Position
  walls: number
}
