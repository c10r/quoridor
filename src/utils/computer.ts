import { Player } from '../models/player'
import { Position } from '../models/position'
import { Wall } from '../models/wall'
import { BoardUtils } from './board'
import { PathUtils } from './path'

export class ComputerUtils {
  static getRandomNumber(max: number): number {
    return Math.floor(Math.random() * Math.floor(max))
  }

  static getStartingPosition(playerIndex: number): Position {
    if (playerIndex === 0) {
      return { x: 0, y: ComputerUtils.getRandomNumber(BoardUtils.BOARD_SIZE) }
    }
    if (playerIndex === 1) {
      return {
        x: BoardUtils.BOARD_SIZE - 1,
        y: ComputerUtils.getRandomNumber(BoardUtils.BOARD_SIZE),
      }
    }
    if (playerIndex === 2) {
      return { x: ComputerUtils.getRandomNumber(BoardUtils.BOARD_SIZE), y: 0 }
    }
    return {
      x: ComputerUtils.getRandomNumber(BoardUtils.BOARD_SIZE),
      y: BoardUtils.BOARD_SIZE - 1,
    }
  }

  static findBestMove(
    playerIndex: number,
    players: Player[],
    walls: Wall[]
  ): Position {
    const adjacentSquares = PathUtils.getAllUnblockedAdjacentSquares(
      players[playerIndex].position!,
      walls
    )

    const scores = adjacentSquares.map((square) => {
      const newPositions = players.map((player) => player.position!)
      newPositions[playerIndex] = square
      return ComputerUtils.evaluateBoard(playerIndex, newPositions, walls)
    })
    const maxScore = Math.max(...scores)

    return adjacentSquares[scores.indexOf(maxScore)]
  }

  /*
  static findBestWall(): Wall {}

  static allPossibleWalls(): Wall[] {}
  */

  // Compares the path length for each player relative to the computer player
  // The higher the number the better for the computer player
  // Always optimize to have the highest average score relative to all players
  static evaluateBoard(
    playerIndex: number,
    playerPositions: Position[],
    walls: Wall[]
  ): number {
    const myPlayer = PathUtils.calculateBFSPathFromPosition(
      [playerPositions[playerIndex]],
      PathUtils.getGoalSquares(playerIndex),
      walls,
      new Set([])
    )

    const otherScores = []
    for (const [index, playerPosition] of playerPositions.entries()) {
      if (index === playerIndex) {
        continue
      }
      otherScores.push(
        PathUtils.calculateBFSPathFromPosition(
          [playerPosition],
          PathUtils.getGoalSquares(index),
          walls,
          new Set([])
        )
      )
    }

    return (
      otherScores.map((score) => myPlayer - score).reduce((a, b) => a + b) /
      otherScores.length
    )
  }
}
