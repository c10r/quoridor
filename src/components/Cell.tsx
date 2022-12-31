import { Component, mergeProps } from 'solid-js'
import { Player } from '../models/player'
import { Position } from '../models/position'
import { PlayerUtils } from '../utils/player'

interface CellProps {
  isEligible: boolean
  isGameOver: boolean
  onClick: () => void
  onMouseEnter: () => void
  players: Player[]
  position: Position
  turn: number
}

const Cell: Component<CellProps> = (oldProps) => {
  const props = mergeProps(oldProps)

  function bgCss(): string {
    if (props.isEligible && !props.isGameOver) {
      return 'bg-white hover:bg-stone-200'
    }
    return 'bg-white'
  }

  function getCss(): string {
    return `flex items-center justify-center w-10 h-10 border border-black rounded-md ${bgCss()}`
  }

  function wrappedOnClick() {
    if (props.isEligible && !props.isGameOver) {
      props.onClick()
    }
  }

  function getPlayerOnCell(): Player | undefined {
    return props.players
      .filter((p) => p.position !== undefined)
      .find(
        (p) =>
          p.position.x === props.position.x && p.position.y === props.position.y
      )
  }

  return (
    <div
      class={getCss()}
      onClick={wrappedOnClick}
      onMouseEnter={props.onMouseEnter}
    >
      {!props.isGameOver && props.isEligible && (
        <div
          class={`w-1 h-1 rounded ${PlayerUtils.getTailwindColor(
            props.players[props.turn % props.players.length].color
          )}`}
        />
      )}
      {!props.isEligible && getPlayerOnCell() && (
        <div
          class={`w-3 h-3 rounded ${PlayerUtils.getTailwindColor(
            getPlayerOnCell().color
          )}`}
        />
      )}
    </div>
  )
}

export default Cell
