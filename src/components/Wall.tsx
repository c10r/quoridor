import { Component, createMemo } from 'solid-js'
import { Player } from '../models/player'
import { Position } from '../models/position'
import { Wall as WallModel } from '../models/wall'
import { PlayerUtils } from '../utils/player'

interface WallProps {
  illegalWall: WallModel | undefined
  isVertical: boolean
  players: Player[]
  position: Position
  temporaryWall: WallModel | undefined
  turn: number
  walls: WallModel[]
}

const Wall: Component<WallProps> = (props) => {
  function isVerticalTemporaryWallOnFirstColumn(): boolean {
    return (
      props.isVertical &&
      props.temporaryWall.isVertical &&
      props.temporaryWall.x === 0 &&
      (props.position.x === 0 || props.position.x === 1) &&
      props.position.y === props.temporaryWall.y
    )
  }

  function isHorizontalTemporaryWallOnFirstRow(): boolean {
    return (
      !props.isVertical &&
      !props.temporaryWall.isVertical &&
      props.temporaryWall.y === 0 &&
      (props.position.y === 0 || props.position.y === 1) &&
      props.position.x === props.temporaryWall.x
    )
  }

  function isHorizontalTemporaryWall(): boolean {
    return (
      !props.isVertical &&
      !props.temporaryWall.isVertical &&
      props.position.x === props.temporaryWall.x &&
      (props.position.y === props.temporaryWall.y ||
        props.position.y === props.temporaryWall.y - 1)
    )
  }

  function isVerticalTemporaryWall(): boolean {
    return (
      props.isVertical &&
      props.temporaryWall.isVertical &&
      props.position.y === props.temporaryWall.y &&
      (props.position.x === props.temporaryWall.x ||
        props.position.x === props.temporaryWall.x - 1)
    )
  }

  function hasTemporaryWall(): boolean {
    if (!props.temporaryWall) return false
    return (
      isHorizontalTemporaryWall() ||
      isHorizontalTemporaryWallOnFirstRow() ||
      isVerticalTemporaryWall() ||
      isVerticalTemporaryWallOnFirstColumn()
    )
  }

  const isPermanentWall = createMemo(() => {
    for (const wall of props.walls) {
      if (wall.isVertical !== props.isVertical) continue
      if (wall.x === props.position.x && wall.y === props.position.y) {
        return true
      }

      if (
        wall.isVertical &&
        props.position.y === wall.y &&
        props.position.x === wall.x - 1
      ) {
        return true
      } else if (
        !wall.isVertical &&
        props.position.x === wall.x &&
        props.position.y === wall.y - 1
      ) {
        return true
      }
    }
    return false
  })

  function isIllegalWall(): boolean {
    if (!props.illegalWall) {
      return false
    }
    if (props.isVertical !== props.illegalWall.isVertical) {
      return false
    }
    const isIllegalVerticalWall =
      props.isVertical &&
      props.position.y === props.illegalWall.y &&
      props.position.x === props.illegalWall.x - 1
    const isIllegalHorizontalWall =
      !props.isVertical &&
      props.position.x === props.illegalWall.x &&
      props.position.y === props.illegalWall.y - 1
    const isExactIllegalWall =
      props.illegalWall.x === props.position.x &&
      props.illegalWall.y === props.position.y &&
      props.illegalWall.isVertical === props.isVertical
    return (
      isExactIllegalWall || isIllegalHorizontalWall || isIllegalVerticalWall
    )
  }

  function getTemporaryWallColor(): string {
    const player = props.players[props.turn % props.players.length]
    return PlayerUtils.getTailwindColor(player.color)
  }

  return (
    <div
      class={`flex ${props.isVertical ? 'flex-col w-2 h-10' : 'w-10 h-2'} ${
        isIllegalWall()
          ? 'bg-red-500'
          : isPermanentWall()
          ? 'bg-stone-400'
          : hasTemporaryWall()
          ? getTemporaryWallColor()
          : 'bg-green-200'
      }`}
    ></div>
  )
}

export default Wall
