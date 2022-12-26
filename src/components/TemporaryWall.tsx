import type { Component } from 'solid-js'

interface TemporaryWallProps {
  isVertical: boolean
}

const TemporaryWall: Component<TemporaryWallProps> = (props) => {
  return (
    <div
      class={`absolute bottom-0 left-0 flex bg-purple-400 ${
        !props.isVertical ? 'w-[88px] h-2' : 'w-2 h-[88px]'
      }`}
    />
  )
}

export default TemporaryWall
