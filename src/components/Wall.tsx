import { Component, createMemo } from 'solid-js'
import { Position } from '../models/position'
import { Wall as WallModel } from '../models/wall'

interface WallProps {
  position: Position
  isVertical: boolean
  temporaryWall: WallModel | undefined
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

  return (
    <div
      class={`flex ${props.isVertical ? 'flex-col w-2 h-10' : 'w-10 h-2'} ${
        isPermanentWall()
          ? 'bg-stone-400'
          : hasTemporaryWall()
          ? 'bg-purple-400'
          : 'bg-green-200'
      }`}
    ></div>
  )
}

export default Wall
