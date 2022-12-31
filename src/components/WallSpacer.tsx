import { Component, createMemo } from 'solid-js'
import { WallSpacer as WallSpacerModel } from '../models/wallspacer'
import { PlayerUtils } from '../utils/player'
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

  function isIllegalWall(): boolean {
    if (!props.illegalWall) {
      return false
    }
    return WallSpacerUtils.hasWall(props, props.illegalWall)
  }

  function getTemporaryWallColor(): string {
    const player = props.players[props.turn % props.players.length]
    return PlayerUtils.getTailwindColor(player.color)
  }

  return (
    <div
      class={`flex w-2 h-2 ${
        isIllegalWall()
          ? 'bg-red-500'
          : isPermanentWall() || WallSpacerUtils.isJointWallSpacer(props)
          ? 'bg-stone-400'
          : WallSpacerUtils.hasWall(props, props.temporaryWall)
          ? getTemporaryWallColor()
          : 'bg-green-200'
      }`}
    />
  )
}

export default WallSpacer
