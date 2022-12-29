import { Wall } from '../models/wall'
import { WallSpacer } from '../models/wallspacer'

export class WallSpacerUtils {
  // Any of the following 2:
  // H(x, y), V(x, y), H(x, y + 2), V(x + 2, y)
  static isJointWallSpacer(wallSpacer: WallSpacer): boolean {
    const jointWalls = wallSpacer.walls.filter((wall) => {
      return (
        (wall.isVertical &&
          wall.x === wallSpacer.position.x &&
          wall.y === wallSpacer.position.y) ||
        (!wall.isVertical &&
          wall.x === wallSpacer.position.x &&
          wall.y === wallSpacer.position.y) ||
        (!wall.isVertical &&
          wall.x === wallSpacer.position.x &&
          wall.y === wallSpacer.position.y + 2) ||
        (wall.isVertical &&
          wall.x === wallSpacer.position.x + 2 &&
          wall.y === wallSpacer.position.y)
      )
    })
    return jointWalls.length >= 2
  }

  // Walls on the 0th column need to look forward since there is no -1 column
  static hasSpecialFirstColumnWall(
    wall: Wall,
    wallSpacer: WallSpacer
  ): boolean {
    return (
      wall.isVertical &&
      wall.x === 0 &&
      wallSpacer.position?.x === wall.x &&
      wallSpacer.position?.y === wall.y
    )
  }

  // Walls on the 0th row need to look forward since there is no -1 row
  static hasSpecialFirstRowWall(wall: Wall, wallSpacer: WallSpacer): boolean {
    return (
      !wall.isVertical &&
      wall.y === 0 &&
      wallSpacer.position?.x === wall.x &&
      wallSpacer.position?.y === wall.y
    )
  }

  static hasVerticalWall(wall: Wall, wallSpacer: WallSpacer): boolean {
    return (
      wall.isVertical &&
      wall.x === wallSpacer.position?.x + 1 &&
      wall.y === wallSpacer.position?.y
    )
  }

  static hasHorizontalWall(wall: Wall, wallSpacer: WallSpacer): boolean {
    return (
      !wall.isVertical &&
      wall.x === wallSpacer.position?.x &&
      wall.y === wallSpacer.position?.y + 1
    )
  }

  static hasWall(wallSpacer: WallSpacer, wall?: Wall): boolean {
    if (!wall) return false
    return (
      WallSpacerUtils.hasVerticalWall(wall, wallSpacer) ||
      WallSpacerUtils.hasSpecialFirstColumnWall(wall, wallSpacer) ||
      WallSpacerUtils.hasHorizontalWall(wall, wallSpacer) ||
      WallSpacerUtils.hasSpecialFirstRowWall(wall, wallSpacer)
    )
  }
}
