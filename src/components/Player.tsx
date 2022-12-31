import { Component, For } from 'solid-js'
import { Player as PlayerModel } from '../models/player'
import { PlayerUtils } from '../utils/player'

interface PlayerProps {
  player: PlayerModel
}

const Player: Component<PlayerProps> = ({ player }: PlayerProps) => {
  return (
    <div class="flex h-full gap-x-2 items-center justify-center px-2.5 py-1">
      {player.name}
      <div class="flex h-full gap-x-0.5 items-center justify-center">
        <For each={new Array(player.walls)}>
          {() => (
            <div
              class={`w-1 h-4 ${PlayerUtils.getTailwindColor(player.color)}`}
            />
          )}
        </For>
      </div>
    </div>
  )
}

export default Player
