import { Component, createMemo } from 'solid-js'
import { Position } from '../models/position'
import { Wall } from '../models/wall'

interface WallSpacerProps {
  position: Position
  temporaryWall: Wall | undefined
  walls: Wall[]
}

const WallSpacer: Component<WallSpacerProps> = (props) => {
  // Walls on the 0th column need to look forward since there is no -1 column
  function hasSpecialFirstColumnWall(wall: Wall): boolean {
    return (
      wall.isVertical &&
      wall.x === 0 &&
      props.position?.x === wall.x &&
      props.position?.y === wall.y
    )
  }

  // Walls on the 0th row need to look forward since there is no -1 row
  function hasSpecialFirstRowWall(wall: Wall): boolean {
    return (
      !wall.isVertical &&
      wall.y === 0 &&
      props.position?.x === wall.x &&
      props.position?.y === wall.y
    )
  }

  function hasVerticalWall(wall: Wall): boolean {
    return (
      wall.isVertical &&
      wall.x === props.position?.x + 1 &&
      wall.y === props.position?.y
    )
  }

  function hasHorizontalWall(wall: Wall): boolean {
    return (
      !wall.isVertical &&
      wall.x === props.position?.x &&
      wall.y === props.position?.y + 1
    )
  }

  function hasWall(wall?: Wall): boolean {
    if (!wall) return false
    return (
      hasVerticalWall(wall) ||
      hasSpecialFirstColumnWall(wall) ||
      hasHorizontalWall(wall) ||
      hasSpecialFirstRowWall(wall)
    )
  }

  const isPermanentWall = createMemo(() => {
    for (const wall of props.walls) {
      if (hasWall(wall)) {
        return true
      }
    }
    return false
  })

  return (
    <div
      class={`flex w-2 h-2 ${
        isPermanentWall()
          ? 'bg-blue-400'
          : hasWall(props.temporaryWall)
          ? 'bg-purple-400'
          : 'bg-green-200'
      }`}
    />
  )
}

export default WallSpacer
