import { Component, createSignal, For } from 'solid-js'
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
  const [eligibility, setEligibility] = createSignal<boolean[][]>(
    new Array(9)
      // If you don't call fill, .map doesn't do anything
      .fill(null)
      .map((element, row) => {
        return new Array(9).fill(row === 0)
      })
  )

  function updateEligibility() {
    const newEligibility: boolean[][] = JSON.parse(
      JSON.stringify(eligibility())
    )
    if (phase() === GamePhase.CHOOSE_STARTING_POSITION) {
      for (const row of [...Array(9).keys()]) {
        for (const column of [...Array(9).keys()]) {
          if (turn() === 0) {
            newEligibility[row][column] = row === 0
          }
          if (turn() === 1) {
            newEligibility[row][column] = row === 8
          }
          if (turn() === 2) {
            newEligibility[row][column] =
              column === 0 &&
              players()[0].position.x !== row &&
              players()[0].position.y !== column
          }
          if (turn() === 3) {
            newEligibility[row][column] =
              column === 8 &&
              players()[1].position.x !== row &&
              players()[1].position.y !== column
          }
        }
      }
    } else {
      // Set everything except for the 4 squares next to the player to false
      // We don't count diagonals
      for (const row of [...Array(9).keys()]) {
        for (const column of [...Array(9).keys()]) {
          newEligibility[row][column] = false
        }
      }
      const { x, y } = players()[turn() % players().length].position!
      // Above
      if (x > 0) {
        newEligibility[x - 1][y] = true
      }
      // Below
      if (x < 8) {
        newEligibility[x + 1][y] = true
      }
      // Left
      if (y > 0) {
        newEligibility[x][y - 1] = true
      }
      // Right
      if (y < 8) {
        newEligibility[x][y + 1] = true
      }
    }
    setEligibility(newEligibility)
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
    updateEligibility()
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
                    return (
                      <Cell
                        isEligible={eligibility()[row()][col()]}
                        onClick={() => onClickCell({ x: row(), y: col() })}
                        players={players()}
                        position={{ x: row(), y: col() }}
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
