import { Component, createMemo } from 'solid-js'
import { WallSpacer as WallSpacerModel } from '../models/wallspacer'
import { WallSpacerUtils } from '../utils/wallspacer'

const WallSpacer: Component<WallSpacerModel> = (props) => {
  const isPermanentWall = createMemo(() => {
    for (const wall of props.walls) {
      if (WallSpacerUtils.hasWall(props, wall)) {
        return true
      }
    }
    return false
  })

  return (
    <div
      class={`flex w-2 h-2 ${
        isPermanentWall() || WallSpacerUtils.isJointWallSpacer(props)
          ? 'bg-stone-400'
          : WallSpacerUtils.hasWall(props, props.temporaryWall)
          ? 'bg-purple-400'
          : 'bg-green-200'
      }`}
    />
  )
}

export default WallSpacer
