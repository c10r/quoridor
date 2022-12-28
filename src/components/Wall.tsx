import type { Component } from 'solid-js'
import { Position } from '../models/position'
import { Wall as WallModel } from '../models/wall'

interface WallProps {
  position: Position
  isVertical: boolean
  wall: WallModel | undefined
}

const Wall: Component<WallProps> = (props) => {
  function isVerticalTemporaryWallOnFirstColumn(): boolean {
    return (
      props.isVertical &&
      props.wall.isVertical &&
      props.wall.x === 0 &&
      (props.position.x === 0 || props.position.x === 1) &&
      props.position.y === props.wall.y
    )
  }

  function isHorizontalTemporaryWallOnFirstRow(): boolean {
    return (
      !props.isVertical &&
      !props.wall.isVertical &&
      props.wall.y === 0 &&
      (props.position.y === 0 || props.position.y === 1) &&
      props.position.x === props.wall.x
    )
  }

  function isHorizontalTemporaryWall(): boolean {
    return (
      !props.isVertical &&
      !props.wall.isVertical &&
      props.position.x === props.wall.x &&
      (props.position.y === props.wall.y ||
        props.position.y === props.wall.y - 1)
    )
  }

  function isVerticalTemporaryWall(): boolean {
    return (
      props.isVertical &&
      props.wall.isVertical &&
      props.position.y === props.wall.y &&
      (props.position.x === props.wall.x ||
        props.position.x === props.wall.x - 1)
    )
  }

  function hasTemporaryWall(): boolean {
    if (!props.wall) return false
    return (
      isHorizontalTemporaryWall() ||
      isHorizontalTemporaryWallOnFirstRow() ||
      isVerticalTemporaryWall() ||
      isVerticalTemporaryWallOnFirstColumn()
    )
  }

  return (
    <div
      class={`flex ${props.isVertical ? 'flex-col w-2 h-10' : 'w-10 h-2'} ${
        hasTemporaryWall() ? 'bg-purple-400' : 'bg-green-200'
      }`}
    ></div>
  )
}

export default Wall
