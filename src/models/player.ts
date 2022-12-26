import { Position } from './position'

export enum PlayerColor {
  BLACK,
  BROWN,
  RED,
  WHITE,
}

export interface Player {
  name: string
  color: PlayerColor
  position?: Position
}
