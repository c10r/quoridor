import { Component, createSignal, For, Match, Switch } from 'solid-js'
import { Player } from '../models/player'
import Cell from './Cell'

interface BoardProps {
  playersProp: Player[]
}

enum GamePhase {
  CHOOSE_STARTING_POSITION,
  PLAYING,
}

interface Position {
  x: number
  y: number
}

const Board: Component<BoardProps> = ({ playersProp }) => {
  const [players, setPlayers] = createSignal(playersProp)
  const [turn, setTurn] = createSignal(0)
  const [phase, setPhase] = createSignal(GamePhase.CHOOSE_STARTING_POSITION)

  function checkIfEligible(position: Position) {
    if (phase() === GamePhase.CHOOSE_STARTING_POSITION) {
      if (turn() === 0) {
        return position.x === 0
      }
      if (turn() === 1) {
        return position.x === 8
      }
      if (turn() === 2) {
        return position.y === 0 && players()[0].position !== position
      }
      if (turn() === 3) {
        return position.y === 8 && players()[1].position !== position
      }
    }
    return false
  }

  function setStartingPosition(position: Position) {
    const playerNumber = turn() % players().length
    const newPlayers = players()
    newPlayers[playerNumber].position = position
    setPlayers(newPlayers)
  }

  function onClickCell(position: Position) {
    if (phase() === GamePhase.CHOOSE_STARTING_POSITION) {
      setStartingPosition(position)
      if (turn() === players().length - 1) {
        setPhase(GamePhase.PLAYING)
      }
    } else {
    }
    setTurn(turn() + 1)
  }

  return (
    <div class="flex flex-col items-center justify-around h-screen w-screen">
      <div>
        {players()[turn() % players().length].name}'s turn{': '}
        {phase() === GamePhase.CHOOSE_STARTING_POSITION
          ? 'Choose a starting position'
          : 'Either move your player or place a wall'}
      </div>
      <div class="flex flex-col gap-y-2">
        <For each={new Array(9)}>
          {(_unused, row) => {
            return (
              <div class="flex gap-x-2">
                <For each={new Array(9)}>
                  {(_unused, col) => {
                    const player = players()
                      .filter((p) => p.position !== undefined)
                      .find(
                        (p) => p.position.x === row() && p.position.y === col()
                      )
                    return (
                      <Cell
                        isEligible={checkIfEligible({ x: row(), y: col() })}
                        onClick={() => onClickCell({ x: row(), y: col() })}
                        player={player}
                      />
                    )
                  }}
                </For>
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}

export default Board
