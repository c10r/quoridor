import { Component, createSignal, For } from 'solid-js'
import { Player } from '../models/player'
import { Wall as WallModel } from '../models/wall'
import Cell from './Cell'
import Wall from './Wall'
import WallSpacer from './WallSpacer'

interface BoardProps {
  gameOver: () => void
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

const Board: Component<BoardProps> = ({ gameOver, playersProp }) => {
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
  const [isGameOver, setIsGameOver] = createSignal(false)
  const [temporaryWall, setTemporaryWall] = createSignal<
    undefined | WallModel
  >()

  function updateTemporaryWall(wall: WallModel | undefined) {
    if (!isGameOver() && phase() !== GamePhase.CHOOSE_STARTING_POSITION) {
      setTemporaryWall(wall)
    }
  }

  function rematch() {
    setPlayers(playersProp)
    setTurn(0)
    setPhase(GamePhase.CHOOSE_STARTING_POSITION)
    setEligibility(
      new Array(9)
        // If you don't call fill, .map doesn't do anything
        .fill(null)
        .map((element, row) => {
          return new Array(9).fill(row === 0)
        })
    )
    setIsGameOver(false)
  }

  function calculateGameOver(): boolean {
    const playerTurn = turn() % players().length
    if (playerTurn === 0) {
      return players()[0].position.x === 8
    }
    if (playerTurn === 1) {
      return players()[1].position.x === 0
    }
    if (playerTurn === 2) {
      return players()[2].position.y === 8
    }
    if (playerTurn === 3) {
      return players()[3].position.y === 0
    }
    return false
  }

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
      // Then exclude the current positions of all players
      for (const row of [...Array(9).keys()]) {
        for (const column of [...Array(9).keys()]) {
          newEligibility[row][column] = false
        }
      }
      const playerPositionsSet = new Set(
        players().map((player) => `${player.position.x}${player.position.y}`)
      )
      const { x, y } = players()[turn() % players().length].position!
      // Above
      if (x > 0 && !playerPositionsSet.has(`${x - 1}${y}`)) {
        newEligibility[x - 1][y] = true
      }
      // Below
      if (x < 8 && !playerPositionsSet.has(`${x + 1}${y}`)) {
        newEligibility[x + 1][y] = true
      }
      // Left
      if (y > 0 && !playerPositionsSet.has(`${x}${y - 1}`)) {
        newEligibility[x][y - 1] = true
      }
      // Right
      if (y < 8 && !playerPositionsSet.has(`${x}${y + 1}`)) {
        newEligibility[x][y + 1] = true
      }
    }
    setEligibility(newEligibility)
  }

  function setPlayerPosition(position: Position) {
    const playerNumber = turn() % players().length
    const newPlayers = players()
    newPlayers[playerNumber].position = position
    setPlayers(newPlayers)
  }

  function onClickCell(position: Position) {
    setPlayerPosition(position)
    if (calculateGameOver()) {
      setIsGameOver(true)
      return
    }
    if (phase() === GamePhase.CHOOSE_STARTING_POSITION) {
      if (turn() === players().length - 1) {
        setPhase(GamePhase.PLAYING)
      }
    }
    setTurn(turn() + 1)
    updateEligibility()
  }

  return (
    <div class="flex flex-col items-center justify-around h-screen w-screen">
      {isGameOver() && (
        <div class="flex flex-col items-center justify-center">
          <h1>{players()[turn() % players().length].name} wins!</h1>
          <button
            class="max-w-max bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            onClick={gameOver}
          >
            Return to Lobby
          </button>
          <button
            class="max-w-max bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={rematch}
          >
            Rematch
          </button>
        </div>
      )}
      {!isGameOver() && (
        <div>
          {players()[turn() % players().length].name}'s turn{': '}
          {phase() === GamePhase.CHOOSE_STARTING_POSITION
            ? 'Choose a starting position'
            : 'Either move your player or place a wall'}
        </div>
      )}
      <div class="flex flex-col">
        <For each={new Array(9)}>
          {(_unused, row) => {
            return (
              <div class="flex flex-col">
                <div class="flex">
                  <For each={new Array(9)}>
                    {(_unused, col) => {
                      return (
                        <div class="flex max-h-max max-w-max">
                          <Cell
                            isEligible={eligibility()[row()][col()]}
                            isGameOver={isGameOver()}
                            onMouseEnter={() => updateTemporaryWall(undefined)}
                            onClick={() => onClickCell({ x: row(), y: col() })}
                            players={players()}
                            position={{ x: row(), y: col() }}
                          />
                          {col() < 8 && (
                            <div
                              class="flex"
                              onMouseEnter={() =>
                                updateTemporaryWall({
                                  x: row(),
                                  y: col(),
                                  isVertical: true,
                                })
                              }
                            >
                              <Wall
                                position={{ x: row(), y: col() }}
                                isVertical={true}
                                wall={temporaryWall()}
                              />
                            </div>
                          )}
                        </div>
                      )
                    }}
                  </For>
                </div>
                {row() < 8 && (
                  <div class="flex">
                    <For each={new Array(9)}>
                      {(_unused, col) => (
                        <div
                          class="flex"
                          onMouseEnter={() =>
                            updateTemporaryWall({
                              x: row(),
                              y: col(),
                              isVertical: false,
                            })
                          }
                        >
                          <Wall
                            isVertical={false}
                            position={{ x: row(), y: col() }}
                            wall={temporaryWall()}
                          />
                          {col() < 8 && (
                            <WallSpacer
                              position={{ x: row(), y: col() }}
                              wall={temporaryWall()}
                            />
                          )}
                        </div>
                      )}
                    </For>
                  </div>
                )}
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}

export default Board
