import { PlayerColor } from '../models/player'

export class PlayerUtils {
  static getTailwindColor(playerColor: PlayerColor): string {
    switch (playerColor) {
      case PlayerColor.BLACK:
        return 'bg-stone-800'
      case PlayerColor.BROWN:
        return 'bg-yellow-500'
      case PlayerColor.RED:
        return 'bg-red-500'
      case PlayerColor.CYAN:
      default:
        return 'bg-cyan-500'
    }
  }
}
