import { Component, createSignal, For } from 'solid-js'
import { GamePhase } from '../models/game'
import { Player as PlayerModel } from '../models/player'
import { Position } from '../models/position'
import { Wall as WallModel } from '../models/wall'
import { BoardUtils } from '../utils/board'
import { PathUtils } from '../utils/path'
import Cell from './Cell'
import Player from './Player'
import Wall from './Wall'
import WallSpacer from './WallSpacer'

interface BoardProps {
  gameOver: () => void
  playersProp: PlayerModel[]
}

const Board: Component<BoardProps> = ({ gameOver, playersProp }) => {
  const [players, setPlayers] = createSignal<PlayerModel[]>(
    JSON.parse(JSON.stringify(playersProp))
  )
  const [turn, setTurn] = createSignal(0)
  const [phase, setPhase] = createSignal(GamePhase.CHOOSE_STARTING_POSITION)
  const [eligibility, setEligibility] = createSignal<boolean[][]>(
    new Array(BoardUtils.BOARD_SIZE)
      // If you don't call fill, .map doesn't do anything
      .fill(null)
      .map((_, row) => {
        return new Array(BoardUtils.BOARD_SIZE).fill(row === 0)
      })
  )
  const [walls, setWalls] = createSignal<WallModel[]>([])
  const [isGameOver, setIsGameOver] = createSignal(false)
  const [temporaryWall, setTemporaryWall] = createSignal<
    undefined | WallModel
  >()
  const [horizontalIntersectionSquares, setHorizontalIntersectionSquares] =
    createSignal<Record<number, Set<number>>>({})
  const [verticalIntersectionSquares, setVerticalIntersectionSquares] =
    createSignal<Record<number, Set<number>>>({})
  const [winningPlayerName, setWinningPlayerName] = createSignal<
    string | undefined
  >()

  function updateTemporaryWall(wall: WallModel | undefined) {
    if (wall === undefined) {
      setTemporaryWall(wall)
      return
    }
    if (!isGameOver() && phase() !== GamePhase.CHOOSE_STARTING_POSITION) {
      if (players()[turn() % players().length].walls > 0) {
        if (
          !BoardUtils.checkIfWallWouldBeIllegal(
            BoardUtils.normalizeClickPosition(
              { x: wall.x, y: wall.y },
              wall.isVertical
            ),
            wall.isVertical,
            horizontalIntersectionSquares(),
            verticalIntersectionSquares()
          )
        ) {
          setTemporaryWall(wall)
        }
      }
    }
  }

  function rematch() {
    setPlayers(JSON.parse(JSON.stringify(playersProp)))
    setTurn(0)
    setTemporaryWall(undefined)
    setWalls([])
    setPhase(GamePhase.CHOOSE_STARTING_POSITION)
    setEligibility(
      new Array(BoardUtils.BOARD_SIZE)
        // If you don't call fill, .map doesn't do anything
        .fill(null)
        .map((element, row) => {
          return new Array(BoardUtils.BOARD_SIZE).fill(row === 0)
        })
    )
    setIsGameOver(false)
  }

  function updateEligibility() {
    const newEligibility = BoardUtils.calculateEligibleSquares(
      eligibility(),
      phase(),
      turn(),
      players(),
      walls()
    )
    setEligibility(newEligibility)
  }

  function setPlayerPosition(position: Position) {
    const playerNumber = turn() % players().length
    const newPlayers = JSON.parse(JSON.stringify(players()))
    newPlayers[playerNumber].position = position
    setPlayers(newPlayers)
  }

  function onClickCell(position: Position) {
    if (!eligibility()[position.x][position.y]) {
      return
    }

    setPlayerPosition(position)
    if (phase() === GamePhase.CHOOSE_STARTING_POSITION) {
      if (turn() === players().length - 1) {
        setPhase(GamePhase.PLAYING)
      }
    } else {
      if (BoardUtils.isGameOver(turn(), players())) {
        setIsGameOver(true)
        setWinningPlayerName(players()[turn() % players().length].name)
      }
    }
    setTurn(turn() + 1)
    updateEligibility()
  }

  function onClickWall(position: Position, isVertical: boolean) {
    // Cannot place walls until starting positions have been defined
    if (phase() !== GamePhase.PLAYING) {
      return
    }

    // Cannot place walls if player has no more walls to place
    const currentPlayer = players()[turn() % players().length]
    if (currentPlayer.walls === 0) {
      return
    }

    const normalizedPosition = BoardUtils.normalizeClickPosition(
      position,
      isVertical
    )
    if (
      BoardUtils.checkIfWallWouldBeIllegal(
        normalizedPosition,
        isVertical,
        horizontalIntersectionSquares(),
        verticalIntersectionSquares()
      )
    ) {
      return
    }

    if (
      PathUtils.blocksOnlyRemainingPathForAnyPlayer(
        { isVertical, x: normalizedPosition.x, y: normalizedPosition.y },
        players(),
        walls()
      )
    ) {
      return
    }

    const { horizontal, vertical } = BoardUtils.getNewIllegalSquares(
      position,
      isVertical,
      horizontalIntersectionSquares(),
      verticalIntersectionSquares()
    )
    setHorizontalIntersectionSquares(horizontal)
    setVerticalIntersectionSquares(vertical)
    setWalls([
      ...walls(),
      { isVertical, x: normalizedPosition.x, y: normalizedPosition.y },
    ])
    const newPlayers = JSON.parse(JSON.stringify(players()))
    newPlayers[turn() % players().length].walls -= 1
    setPlayers(newPlayers)
    setTurn(turn() + 1)
    updateEligibility()
  }

  return (
    <div class="flex flex-col items-center justify-around h-screen w-screen">
      {isGameOver() && (
        <div class="flex flex-col items-center justify-center">
          <h1>{winningPlayerName()} wins!</h1>
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
          {players()[turn() % players().length].name}
          {': '}
          {phase() === GamePhase.CHOOSE_STARTING_POSITION
            ? 'Choose a starting position'
            : players()[turn() % players().length].walls > 0
            ? 'Move your player or place a wall'
            : 'Move your player'}
        </div>
      )}
      <div class="flex w-full justify-around items-center">
        <For each={players()}>{(player, _) => <Player player={player} />}</For>
      </div>
      <div class="flex flex-col p-3 bg-green-200 rounded">
        <For each={new Array(BoardUtils.BOARD_SIZE)}>
          {(_unused, row) => {
            return (
              <div class="flex flex-col">
                <div class="flex">
                  <For each={new Array(BoardUtils.BOARD_SIZE)}>
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
                            turn={turn()}
                          />
                          {col() < BoardUtils.BOARD_SIZE - 1 && (
                            <div
                              class="flex"
                              onClick={() =>
                                onClickWall({ x: row(), y: col() }, true)
                              }
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
                                temporaryWall={temporaryWall()}
                                walls={walls()}
                              />
                            </div>
                          )}
                        </div>
                      )
                    }}
                  </For>
                </div>
                {row() < BoardUtils.BOARD_SIZE - 1 && (
                  <div class="flex">
                    <For each={new Array(BoardUtils.BOARD_SIZE)}>
                      {(_unused, col) => (
                        <div class="flex">
                          <div
                            onClick={() =>
                              onClickWall({ x: row(), y: col() }, false)
                            }
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
                              temporaryWall={temporaryWall()}
                              walls={walls()}
                            />
                          </div>
                          {col() < BoardUtils.BOARD_SIZE - 1 && (
                            <WallSpacer
                              position={{ x: row(), y: col() }}
                              temporaryWall={temporaryWall()}
                              walls={walls()}
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
