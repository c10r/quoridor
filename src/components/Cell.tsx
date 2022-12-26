import type { Component } from 'solid-js'
import { Player, PlayerColor } from '../models/player'

interface CellProps {
  isEligible: boolean
  onClick: () => void
  player?: Player
}

const Cell: Component<CellProps> = ({ isEligible, onClick, player }) => {
  function getColor(playerColor: PlayerColor): string {
    switch (playerColor) {
      case PlayerColor.BLACK:
        return 'bg-stone-800'
      case PlayerColor.BROWN:
        return 'bg-orange-800'
      case PlayerColor.RED:
        return 'bg-red-500'
      case PlayerColor.WHITE:
        return 'bg-stone-100'
    }
  }

  function hoverCss(): string {
    if (isEligible) {
      return 'hover:bg-stone-200'
    }
    return ''
  }

  function getCss(): string {
    return `flex items-center justify-center w-10 h-10 border border-black rounded-md ${hoverCss()}`
  }

  function wrappedOnClick() {
    if (isEligible) {
      onClick()
    }
  }

  return (
    <div class={getCss()} onClick={wrappedOnClick}>
      {isEligible && <div class="w-1 h-1 rounded bg-gray-500" />}
      {!isEligible && player && (
        <div class={`w-2 h-2 rounded ${getColor(player.color)}`} />
      )}
    </div>
  )
}

export default Cell
