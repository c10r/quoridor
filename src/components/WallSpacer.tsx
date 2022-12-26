import type { Component } from 'solid-js'

interface WallSpacerProps {
  hasWall: boolean
}

const Wall: Component<WallSpacerProps> = (props) => {
  return (
    <div
      class={`flex w-2 h-2' ${props.hasWall ? 'bg-green-400' : 'bg-green-200'}`}
    />
  )
}

export default Wall
