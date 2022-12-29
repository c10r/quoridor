import { Component, For } from 'solid-js'
import { Player as PlayerModel } from '../models/player'

interface PlayerProps {
  player: PlayerModel
}

const Player: Component<PlayerProps> = ({ player }: PlayerProps) => {
  return (
    <div class="flex h-full gap-x-1 items-center justify-between">
      {player.name}
      <div class="flex h-full gap-x-0.5 items-center justify-center">
        <For each={new Array(player.walls)}>
          {() => <div class="w-1 h-4 bg-purple-400" />}
        </For>
      </div>
    </div>
  )
}

export default Player
