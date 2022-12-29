import { Player } from '../models/player'
import { Position } from '../models/position'
import { Wall } from '../models/wall'
import { BoardUtils } from './board'

export class PathUtils {
  static blocksOnlyRemainingPathForAnyPlayer(
    newWall: Wall,
    players: Player[],
    walls: Wall[]
  ): boolean {
    // Cannot block a path with fewer than 2 walls
    // Saves the cost of calculating this every time early on
    if (walls.length < 1) {
      return false
    }

    const blockedPlayers = players
      .map((player, index) => {
        let goalPositions: Position[]
        if (index === 0) {
          goalPositions = Array(BoardUtils.BOARD_SIZE)
            .fill(null)
            .map((_, index) => {
              return { x: BoardUtils.BOARD_SIZE - 1, y: index }
            })
        } else if (index === 1) {
          goalPositions = Array(BoardUtils.BOARD_SIZE)
            .fill(null)
            .map((_, index) => {
              return { x: 0, y: index }
            })
        } else if (index === 2) {
          goalPositions = Array(BoardUtils.BOARD_SIZE)
            .fill(null)
            .map((_, index) => {
              return { x: index, y: BoardUtils.BOARD_SIZE - 1 }
            })
        } else {
          goalPositions = Array(BoardUtils.BOARD_SIZE)
            .fill(null)
            .map((_, index) => {
              return { x: index, y: 0 }
            })
        }
        return PathUtils.blocksOnlyRemainingPathForSinglePlayer(
          newWall,
          player,
          goalPositions,
          walls
        )
      })
      .filter((doesBlock) => doesBlock)
    return blockedPlayers.length > 0
  }

  static blocksOnlyRemainingPathForSinglePlayer(
    newWall: Wall,
    player: Player,
    goalSquares: Position[],
    walls: Wall[]
  ): boolean {
    return PathUtils.blocksOnlyRemainingPathForSinglePlayerHelper(
      player.position!,
      goalSquares,
      [...walls, newWall],
      []
    )
  }

  static blocksOnlyRemainingPathForSinglePlayerHelper(
    position: Position,
    goalSquares: Position[],
    walls: Wall[],
    visitedSquares: Position[]
  ): boolean {
    const matchingGoal = goalSquares.filter(
      (p) => position.x === p.x && position.y === p.y
    )
    if (matchingGoal.length > 0) {
      return false
    }

    const unblockedAdjacentSquares = PathUtils.getAllUnblockedAdjacentSquares(
      position,
      walls
    ).filter((position) => {
      const checkVisited = visitedSquares.filter(
        (p) => p.x === position.x && p.y === position.y
      )
      return checkVisited.length === 0
    })

    return (
      (unblockedAdjacentSquares.length > 0
        ? PathUtils.blocksOnlyRemainingPathForSinglePlayerHelper(
            unblockedAdjacentSquares[0],
            goalSquares,
            walls,
            [...visitedSquares, position]
          )
        : true) &&
      (unblockedAdjacentSquares.length > 1
        ? PathUtils.blocksOnlyRemainingPathForSinglePlayerHelper(
            unblockedAdjacentSquares[1],
            goalSquares,
            walls,
            [...visitedSquares, position]
          )
        : true) &&
      (unblockedAdjacentSquares.length > 2
        ? PathUtils.blocksOnlyRemainingPathForSinglePlayerHelper(
            unblockedAdjacentSquares[2],
            goalSquares,
            walls,
            [...visitedSquares, position]
          )
        : true) &&
      (unblockedAdjacentSquares.length > 3
        ? PathUtils.blocksOnlyRemainingPathForSinglePlayerHelper(
            unblockedAdjacentSquares[3],
            goalSquares,
            walls,
            [...visitedSquares, position]
          )
        : true)
    )
  }

  static getAllUnblockedAdjacentSquares(
    position: Position,
    walls: Wall[]
  ): Position[] {
    const allAdjacentSquares = [
      PathUtils.getSquareAbove(position),
      PathUtils.getSquareBelow(position),
      PathUtils.getSquareLeft(position),
      PathUtils.getSquareRight(position),
    ]

    return allAdjacentSquares
      .filter((x) => x !== undefined)
      .filter((x) => !PathUtils.isAdjacentSquareBlocked(position, x, walls))
  }

  static getSquareAbove(position: Position): Position | undefined {
    if (position.x > 0) {
      return { x: position.x - 1, y: position.y }
    }
    return undefined
  }

  static getSquareBelow(position: Position): Position | undefined {
    if (position.x < BoardUtils.BOARD_SIZE - 1) {
      return { x: position.x + 1, y: position.y }
    }
    return undefined
  }

  static getSquareLeft(position: Position): Position | undefined {
    if (position.y > 0) {
      return { x: position.x, y: position.y - 1 }
    }
    return undefined
  }

  static getSquareRight(position: Position): Position | undefined {
    if (position.y < BoardUtils.BOARD_SIZE - 1) {
      return { x: position.x, y: position.y + 1 }
    }
    return undefined
  }

  static isAdjacentSquareBlocked(
    from: Position,
    to: Position,
    walls: Wall[]
  ): boolean {
    const isAbove = to.x === from.x - 1 && to.y === from.y
    const isBelow = to.x === from.x + 1 && to.y === from.y
    const isLeft = to.x === from.x && to.y === from.y - 1
    const isRight = to.x === from.x && to.y === from.y + 1
    if (!isAbove && !isBelow && !isLeft && !isRight) {
      throw new Error(`Position ${from} and ${to} are not adjacent`)
    }

    let blockingWalls: Wall[]
    if (isAbove) {
      blockingWalls = walls.filter(
        (w) =>
          !w.isVertical &&
          w.x === from.x - 1 &&
          (w.y === from.y || w.y === from.y + 1)
      )
    } else if (isBelow) {
      blockingWalls = walls.filter(
        (w) =>
          !w.isVertical &&
          w.x === from.x &&
          (w.y === from.y || w.y === from.y + 1)
      )
    } else if (isLeft) {
      blockingWalls = walls.filter(
        (w) =>
          w.isVertical &&
          ((w.x === from.x && w.y === from.y - 1) ||
            (w.x === from.x + 1 && w.y === from.y - 1))
      )
    } else {
      blockingWalls = walls.filter(
        (w) =>
          w.isVertical &&
          ((w.x === from.x && w.y === from.y) ||
            (w.x === from.x + 1 && w.y === from.y))
      )
    }
    return blockingWalls.length > 0
  }
}
