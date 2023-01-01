import { Component, For } from 'solid-js'
import { Player as PlayerModel } from '../models/player'
import { PlayerUtils } from '../utils/player'

interface PlayerProps {
  player: PlayerModel
}

const Player: Component<PlayerProps> = (props: PlayerProps) => {
  return (
    <div class="flex h-full gap-x-2 items-center justify-center px-2.5 py-1">
      {props.player.name}
      <div class="flex h-full gap-x-0.5 items-center justify-center">
        <For each={new Array(props.player.walls)}>
          {() => (
            <div
              class={`w-1 h-4 ${PlayerUtils.getTailwindColor(
                props.player.color
              )}`}
            />
          )}
        </For>
      </div>
    </div>
  )
}

export default Player
