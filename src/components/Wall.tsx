import type { Component } from 'solid-js'

interface WallProps {
  hasWall: boolean
  isVertical: boolean
}

const Wall: Component<WallProps> = (props) => {
  return (
    <div
      class={`flex ${props.isVertical ? 'flex-col w-2 h-10' : 'w-10 h-2'} ${
        props.hasWall ? 'bg-green-400' : 'bg-green-200'
      }`}
    ></div>
  )
}

export default Wall
