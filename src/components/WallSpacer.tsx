import type { Component } from 'solid-js'
import { Position } from '../models/position'
import { Wall } from '../models/wall'

interface WallSpacerProps {
  position: Position
  wall: Wall | undefined
}

const WallSpacer: Component<WallSpacerProps> = (props) => {
  // Walls on the 0th column need to look forward since there is no -1 column
  function hasSpecialFirstColumnWall(): boolean {
    return (
      props.wall?.isVertical &&
      props.wall?.x === 0 &&
      props.position?.x === props.wall?.x &&
      props.position?.y === props.wall?.y
    )
  }

  // Walls on the 0th row need to look forward since there is no -1 row
  function hasSpecialFirstRowWall(): boolean {
    return (
      !props.wall?.isVertical &&
      props.wall?.y === 0 &&
      props.position?.x === props.wall?.x &&
      props.position?.y === props.wall?.y
    )
  }

  function hasVerticalWall(): boolean {
    return (
      props.wall?.isVertical &&
      props.wall?.x === props.position?.x + 1 &&
      props.wall?.y === props.position?.y
    )
  }

  function hasHorizontalWall(): boolean {
    return (
      !props.wall?.isVertical &&
      props.wall?.x === props.position?.x &&
      props.wall?.y === props.position?.y + 1
    )
  }

  function hasWall(): boolean {
    if (!props.wall) return false
    return (
      hasVerticalWall() ||
      hasSpecialFirstColumnWall() ||
      hasHorizontalWall() ||
      hasSpecialFirstRowWall()
    )
  }

  return (
    <div
      class={`flex w-2 h-2 ${hasWall() ? 'bg-purple-400' : 'bg-green-200'}`}
    />
  )
}

export default WallSpacer
