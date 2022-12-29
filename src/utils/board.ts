import { GamePhase } from '../models/game'
import { Player } from '../models/player'
import { Position } from '../models/position'
import { Wall } from '../models/wall'

export class BoardUtils {
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
      return players[0].position.x === 8
    }
    if (playerTurn === 1) {
      return players[1].position.x === 0
    }
    if (playerTurn === 2) {
      return players[2].position.y === 8
    }
    if (playerTurn === 3) {
      return players[3].position.y === 0
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
      for (const row of [...Array(9).keys()]) {
        for (const column of [...Array(9).keys()]) {
          if (turn === 0) {
            newEligibility[row][column] = row === 0
          }
          if (turn === 1) {
            newEligibility[row][column] = row === 8
          }
          if (turn === 2) {
            newEligibility[row][column] =
              column === 0 &&
              players[0].position.x !== row &&
              players[0].position.y !== column
          }
          if (turn === 3) {
            newEligibility[row][column] =
              column === 8 &&
              players[1].position.x !== row &&
              players[1].position.y !== column
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
        players.map((player) => `${player.position.x}${player.position.y}`)
      )
      const { x, y } = players[turn % players.length].position!
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
    return newEligibility
  }

  static blocksOnlyRemainingPath(
    positionOfNewWall: Position,
    players: Player[],
    walls: Wall[]
  ): boolean {
    // Cannot block a path with fewer than 2 walls
    // Saves the cost of calculating this every time early on
    if (walls.length < 2) {
      return false
    }
    // TODO
    return false
  }

  static wallIntersectsOtherWalls(
    newWallPosition: Position,
    isNewWallVertical: boolean,
    walls: Wall[]
  ): boolean {
    for (const wall of walls) {
      // Exact overlap
      if (
        newWallPosition.x === wall.x &&
        newWallPosition.y === wall.y &&
        isNewWallVertical === wall.isVertical
      ) {
        return true
      }

      if (wall.isVertical) {
        if (
          // V(x ± 1, y) or H(x - 1, y + 1) are banned
          (isNewWallVertical &&
            newWallPosition.y === wall.y &&
            (newWallPosition.x === wall.x + 1 ||
              newWallPosition.x === wall.x - 1)) ||
          (!isNewWallVertical &&
            newWallPosition.y === wall.y + 1 &&
            newWallPosition.x === wall.x - 1)
        ) {
          return true
        }
      } else {
        // H(x, y ± 1) or V(h + 1, y - 1) are banned
        if (
          (!isNewWallVertical &&
            newWallPosition.x === wall.x &&
            (newWallPosition.y === wall.y - 1 ||
              newWallPosition.y === wall.y + 1)) ||
          (isNewWallVertical &&
            newWallPosition.x === wall.x + 1 &&
            newWallPosition.y === wall.y - 1)
        ) {
          return true
        }
      }
    }
    return false
  }
}
