import { GamePhase } from '../models/game'
import { Player } from '../models/player'
import { Position } from '../models/position'
import { Wall } from '../models/wall'
import { PathUtils } from './path'

export class BoardUtils {
  static BOARD_SIZE = 9

  static normalizeClickPosition(
    position: Position,
    isVertical: boolean
  ): Position {
    if (isVertical && position.x === 0) {
      return { x: 1, y: position.y }
    }
    if (!isVertical && position.y === 0) {
      return { x: position.x, y: 1 }
    }
    return position
  }

  static isGameOver(turn: number, players: Player[]): boolean {
    const playerTurn = turn % players.length
    if (playerTurn === 0) {
      return players[0].position?.x === BoardUtils.BOARD_SIZE - 1
    }
    if (playerTurn === 1) {
      return players[1].position?.x === 0
    }
    if (playerTurn === 2) {
      return players[2].position?.y === BoardUtils.BOARD_SIZE - 1
    }
    if (playerTurn === 3) {
      return players[3].position?.y === 0
    }
    return false
  }

  static calculateEligibleSquares(
    currentEligibilities: boolean[][],
    phase: GamePhase,
    turn: number,
    players: Player[],
    walls: Wall[]
  ): boolean[][] {
    const newEligibility = JSON.parse(JSON.stringify(currentEligibilities))
    if (phase === GamePhase.CHOOSE_STARTING_POSITION) {
      for (const row of [...Array(BoardUtils.BOARD_SIZE).keys()]) {
        for (const column of [...Array(BoardUtils.BOARD_SIZE).keys()]) {
          if (turn === 0) {
            newEligibility[row][column] = row === 0
          }
          if (turn === 1) {
            newEligibility[row][column] = row === BoardUtils.BOARD_SIZE - 1
          }
          if (turn === 2) {
            newEligibility[row][column] =
              column === 0 &&
              (players[0].position?.x !== row ||
                players[0].position?.y !== column) &&
              (players[1].position?.x !== row ||
                players[1].position?.y !== column)
          }
          if (turn === 3) {
            newEligibility[row][column] =
              column === BoardUtils.BOARD_SIZE - 1 &&
              (players[0].position?.x !== row ||
                players[0].position?.y !== column) &&
              (players[1].position?.x !== row ||
                players[1].position?.y !== column) &&
              (players[2].position?.x !== row ||
                players[2].position?.y !== column)
          }
        }
      }
    } else {
      // Set everything except for the 4 squares next to the player to false
      // We don't count diagonals
      for (const row of [...Array(BoardUtils.BOARD_SIZE).keys()]) {
        for (const column of [...Array(BoardUtils.BOARD_SIZE).keys()]) {
          newEligibility[row][column] = false
        }
      }

      // Then exclude the current positions of all players and walls blocking paths
      const playerPositionsSet = new Set(
        players.map((player) => `${player.position?.x}${player.position?.y}`)
      )
      const { x, y } = players[turn % players.length].position!
      // Above
      if (
        x > 0 &&
        !playerPositionsSet.has(`${x - 1}${y}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x: x - 1, y }, walls)
      ) {
        newEligibility[x - 1][y] = true
      }
      // Below
      if (
        x < BoardUtils.BOARD_SIZE - 1 &&
        !playerPositionsSet.has(`${x + 1}${y}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x: x + 1, y: y }, walls)
      ) {
        newEligibility[x + 1][y] = true
      }
      // Left
      if (
        y > 0 &&
        !playerPositionsSet.has(`${x}${y - 1}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x, y: y - 1 }, walls)
      ) {
        newEligibility[x][y - 1] = true
      }
      // Right
      if (
        y < BoardUtils.BOARD_SIZE - 1 &&
        !playerPositionsSet.has(`${x}${y + 1}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x, y: y + 1 }, walls)
      ) {
        newEligibility[x][y + 1] = true
      }

      // Allow jumping
      // Above
      if (
        x > 1 &&
        playerPositionsSet.has(`${x - 1}${y}`) &&
        !playerPositionsSet.has(`${x - 2}${y}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x: x - 1, y }, walls) &&
        !PathUtils.isAdjacentSquareBlocked(
          { x: x - 1, y },
          { x: x - 2, y },
          walls
        )
      ) {
        newEligibility[x - 2][y] = true
      }
      // Below
      if (
        x < BoardUtils.BOARD_SIZE - 2 &&
        playerPositionsSet.has(`${x + 1}${y}`) &&
        !playerPositionsSet.has(`${x + 2}${y}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x: x + 1, y }, walls) &&
        !PathUtils.isAdjacentSquareBlocked(
          { x: x + 1, y },
          { x: x + 2, y },
          walls
        )
      ) {
        newEligibility[x + 2][y] = true
      }
      // Left
      if (
        y > 1 &&
        playerPositionsSet.has(`${x}${y - 1}`) &&
        !playerPositionsSet.has(`${x}${y - 2}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x, y: y - 1 }, walls) &&
        !PathUtils.isAdjacentSquareBlocked(
          { x, y: y - 1 },
          { x, y: y - 2 },
          walls
        )
      ) {
        newEligibility[x][y - 2] = true
      }
      // Right
      if (
        y < BoardUtils.BOARD_SIZE - 2 &&
        playerPositionsSet.has(`${x}${y + 1}`) &&
        !playerPositionsSet.has(`${x}${y + 2}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x, y: y + 1 }, walls) &&
        !PathUtils.isAdjacentSquareBlocked(
          { x, y: y + 1 },
          { x, y: y + 2 },
          walls
        )
      ) {
        newEligibility[x][y + 2] = true
      }

      // Diagonals
      // If the square you'd jump to is a wall or blocked by a wall,
      // you can jump diagonally to avoid it
      // N  | NE |
      // me | x  | blocked
      // S  | SE |

      // Alternatively, if you can't jump over the opponent because the square
      // after would be off the board, you can jump diagonally
      // N   | NE  |
      // me  | x   | <no square here>
      const topIsBlocked =
        x > 1 &&
        playerPositionsSet.has(`${x - 1}${y}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x: x - 1, y }, walls) &&
        (PathUtils.isAdjacentSquareBlocked(
          { x: x - 1, y },
          { x: x - 2, y },
          walls
        ) ||
          playerPositionsSet.has(`${x - 2}${y}`))
      const rightIsBlocked =
        y < BoardUtils.BOARD_SIZE - 1 &&
        playerPositionsSet.has(`${x}${y + 1}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x, y: y + 1 }, walls) &&
        (PathUtils.isAdjacentSquareBlocked(
          { x, y: y + 1 },
          { x, y: y + 2 },
          walls
        ) ||
          playerPositionsSet.has(`${x}${y + 2}`))
      const bottomIsBlocked =
        x < BoardUtils.BOARD_SIZE - 1 &&
        playerPositionsSet.has(`${x + 1}${y}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x: x + 1, y }, walls) &&
        (PathUtils.isAdjacentSquareBlocked(
          { x: x + 1, y },
          { x: x + 2, y },
          walls
        ) ||
          playerPositionsSet.has(`${x + 2}${y}`))
      const leftIsBlocked =
        y > 1 &&
        playerPositionsSet.has(`${x}${y - 1}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x, y: y - 1 }, walls) &&
        (PathUtils.isAdjacentSquareBlocked(
          { x, y: y - 1 },
          { x, y: y - 2 },
          walls
        ) ||
          playerPositionsSet.has(`${x}${y - 2}`))
      const topIsEdge =
        x === 1 &&
        playerPositionsSet.has(`${x - 1}${y}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x: x - 1, y }, walls)
      const rightIsEdge =
        y === BoardUtils.BOARD_SIZE - 1 &&
        playerPositionsSet.has(`${x}${y + 1}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x, y: y + 1 }, walls)
      const bottomIsEdge =
        x === BoardUtils.BOARD_SIZE - 1 &&
        playerPositionsSet.has(`${x + 1}${y}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x: x + 1, y }, walls)
      const leftIsEdge =
        y === 1 &&
        playerPositionsSet.has(`${x}${y - 1}`) &&
        !PathUtils.isAdjacentSquareBlocked({ x, y }, { x, y: y - 1 }, walls)

      // Top right -> x - 1, y + 1
      if (
        x > 0 &&
        y < BoardUtils.BOARD_SIZE &&
        ((topIsBlocked &&
          !PathUtils.isAdjacentSquareBlocked(
            { x: x - 1, y },
            { x: x - 1, y: y + 1 },
            walls
          )) ||
          (rightIsBlocked &&
            !PathUtils.isAdjacentSquareBlocked(
              { x, y: y + 1 },
              { x: x - 1, y: y + 1 },
              walls
            )) ||
          (topIsEdge &&
            !PathUtils.isAdjacentSquareBlocked(
              { x: x - 1, y },
              { x: x - 1, y: y + 1 },
              walls
            )) ||
          (rightIsEdge &&
            !PathUtils.isAdjacentSquareBlocked(
              { x, y: y + 1 },
              { x: x - 1, y: y + 1 },
              walls
            )))
      ) {
        newEligibility[x - 1][y + 1] = true
      }
      // Bottom right -> x + 1, y + 1
      if (
        x < BoardUtils.BOARD_SIZE &&
        y < BoardUtils.BOARD_SIZE &&
        ((bottomIsBlocked &&
          !PathUtils.isAdjacentSquareBlocked(
            { x: x + 1, y },
            { x: x + 1, y: y + 1 },
            walls
          )) ||
          (rightIsBlocked &&
            !PathUtils.isAdjacentSquareBlocked(
              { x, y: y + 1 },
              { x: x + 1, y: y + 1 },
              walls
            )) ||
          (bottomIsEdge &&
            !PathUtils.isAdjacentSquareBlocked(
              { x: x + 1, y },
              { x: x + 1, y: y + 1 },
              walls
            )) ||
          (rightIsEdge &&
            !PathUtils.isAdjacentSquareBlocked(
              { x, y: y + 1 },
              { x: x + 1, y: y + 1 },
              walls
            )))
      ) {
        newEligibility[x + 1][y + 1] = true
      }
      // Top left -> x - 1, y - 1
      if (
        x > 0 &&
        y > 0 &&
        ((topIsBlocked &&
          !PathUtils.isAdjacentSquareBlocked(
            { x: x - 1, y },
            { x: x - 1, y: y - 1 },
            walls
          )) ||
          (leftIsBlocked &&
            !PathUtils.isAdjacentSquareBlocked(
              { x, y: y - 1 },
              { x: x - 1, y: y - 1 },
              walls
            )) ||
          (topIsEdge &&
            !PathUtils.isAdjacentSquareBlocked(
              { x: x - 1, y },
              { x: x - 1, y: y - 1 },
              walls
            )) ||
          (leftIsEdge &&
            !PathUtils.isAdjacentSquareBlocked(
              { x, y: y - 1 },
              { x: x - 1, y: y - 1 },
              walls
            )))
      ) {
        newEligibility[x - 1][y - 1] = true
      }
      // Bottom left -> x + 1, y - 1
      if (
        y > 0 &&
        x < BoardUtils.BOARD_SIZE &&
        ((bottomIsBlocked &&
          !PathUtils.isAdjacentSquareBlocked(
            { x: x + 1, y },
            { x: x + 1, y: y - 1 },
            walls
          )) ||
          (leftIsBlocked &&
            !PathUtils.isAdjacentSquareBlocked(
              { x, y: y - 1 },
              { x: x + 1, y: y - 1 },
              walls
            )) ||
          (bottomIsEdge &&
            !PathUtils.isAdjacentSquareBlocked(
              { x: x + 1, y },
              { x: x + 1, y: y - 1 },
              walls
            )) ||
          (leftIsEdge &&
            !PathUtils.isAdjacentSquareBlocked(
              { x, y: y - 1 },
              { x: x + 1, y: y - 1 },
              walls
            )))
      ) {
        newEligibility[x + 1][y - 1] = true
      }
    }
    return newEligibility
  }

  static getIllegalSquaresForWall(
    newWallPosition: Position,
    isVertical: boolean
  ): Record<'horizontal' | 'vertical', Record<number, Set<number>>> {
    if (isVertical) {
      // V(x ?? 1, y) or H(x - 1, y + 1) are banned
      return {
        horizontal: {
          [newWallPosition.x - 1]: new Set([newWallPosition.y + 1]),
        },
        vertical: {
          [newWallPosition.x - 1]: new Set([newWallPosition.y]),
          [newWallPosition.x + 1]: new Set([newWallPosition.y]),
        },
      }
    }

    // H(x, y ?? 1) or V(x + 1, y - 1) are banned
    return {
      horizontal: {
        [newWallPosition.x]: new Set([
          newWallPosition.y - 1,
          newWallPosition.y + 1,
        ]),
      },
      vertical: {
        [newWallPosition.x + 1]: new Set([newWallPosition.y - 1]),
      },
    }
  }

  static checkIfWallWouldBeIllegal(
    wallPosition: Position,
    isVertical: boolean,
    horizontalIntersectionSquares: Record<number, Set<number>>,
    verticalIntersectionSquares: Record<number, Set<number>>
  ): boolean {
    if (isVertical) {
      return (
        wallPosition.x in verticalIntersectionSquares &&
        verticalIntersectionSquares[wallPosition.x].has(wallPosition.y)
      )
    }
    return (
      wallPosition.x in horizontalIntersectionSquares &&
      horizontalIntersectionSquares[wallPosition.x].has(wallPosition.y)
    )
  }

  static getNewIllegalSquares(
    position: Position,
    isVertical: boolean,
    horizontalIntersectionSquares: Record<number, Set<number>>,
    verticalIntersectionSquares: Record<number, Set<number>>
  ): Record<'horizontal' | 'vertical', Record<number, Set<number>>> {
    // Deep clone objects tracking illegal horizontal / vertical squares
    let newHorizontal: Record<number, Set<number>> = {}
    let newVertical: Record<number, Set<number>> = {}
    for (const [key, value] of Object.entries(horizontalIntersectionSquares)) {
      newHorizontal[Number.parseInt(key)] = new Set([...value])
    }
    for (const [key, value] of Object.entries(verticalIntersectionSquares)) {
      newVertical[Number.parseInt(key)] = new Set([...value])
    }

    // Add new entires for conflicts
    const newIllegalSquares = BoardUtils.getIllegalSquaresForWall(
      position,
      isVertical
    )
    for (const [key, value] of Object.entries(newIllegalSquares.horizontal)) {
      if (key in newHorizontal) {
        newHorizontal[Number.parseInt(key)] = new Set([
          ...value,
          ...newHorizontal[Number.parseInt(key)],
        ])
      } else {
        newHorizontal[Number.parseInt(key)] = new Set([...value])
      }
    }
    for (const [key, value] of Object.entries(newIllegalSquares.vertical)) {
      if (key in newVertical) {
        newVertical[Number.parseInt(key)] = new Set([
          ...value,
          ...newVertical[Number.parseInt(key)],
        ])
      } else {
        newVertical[Number.parseInt(key)] = new Set([...value])
      }
    }

    // Add new entries preventing exact duplicates
    if (isVertical) {
      if (position.x in newVertical) {
        newVertical[position.x] = new Set([
          position.y,
          ...newVertical[position.x],
        ])
      } else {
        newVertical[position.x] = new Set([position.y])
      }
    } else {
      if (position.x in newHorizontal) {
        newHorizontal[position.x] = new Set([
          position.y,
          ...newHorizontal[position.x],
        ])
      } else {
        newHorizontal[position.x] = new Set([position.y])
      }
    }
    return { horizontal: newHorizontal, vertical: newVertical }
  }
}
