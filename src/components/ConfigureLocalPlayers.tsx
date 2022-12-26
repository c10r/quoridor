import { Component, createSignal, For } from 'solid-js'
import { Player, PlayerColor } from '../models/player'

interface ConfigureLocalPlayersProps {
  startGame: (players: Player[]) => void
}

const TOTAL_WALLS = 20

const ConfigureLocalPlayers: Component<ConfigureLocalPlayersProps> = ({
  startGame,
}) => {
  const [numPlayers, setNumPlayers] = createSignal(2)
  const [players, setPlayers] = createSignal<Player[]>([
    {
      name: '',
      color: PlayerColor.BLACK,
      walls: Math.floor(TOTAL_WALLS / 2),
    },
    {
      name: '',
      color: PlayerColor.BROWN,
      walls: Math.floor(TOTAL_WALLS / 2),
    },
  ])

  function playerColorToCss(playerColor: PlayerColor): string {
    switch (playerColor) {
      case PlayerColor.BLACK:
        return 'bg-stone-800'
      case PlayerColor.BROWN:
        return 'bg-orange-800'
      case PlayerColor.RED:
        return 'bg-red-500'
      case PlayerColor.WHITE:
      default:
        return 'bg-stone-100'
    }
  }

  function tryAndStartGame() {
    if (allNamesFilled()) {
      startGame(players())
    }
  }

  function updateNumberOfPlayers(newCount: number) {
    if (newCount === numPlayers()) {
      return
    }

    if (newCount < numPlayers()) {
      setNumPlayers(newCount)
      const newPlayers = players().slice(0, newCount)
      for (const index in newPlayers) {
        newPlayers[Number.parseInt(index)].walls = Math.floor(
          TOTAL_WALLS / newCount
        )
      }
      setPlayers(players().slice(0, newCount))
      return
    }

    let newPlayers = players()
    for (const index in newPlayers) {
      newPlayers[Number.parseInt(index)].walls = Math.floor(
        TOTAL_WALLS / newCount
      )
    }
    if (newPlayers.length === 2) {
      newPlayers.push({
        name: '',
        color: PlayerColor.RED,
        walls: Math.floor(TOTAL_WALLS / newCount),
      })
    }
    newPlayers.push({
      name: '',
      color: PlayerColor.WHITE,
      walls: Math.floor(TOTAL_WALLS / newCount),
    })

    setNumPlayers(newCount)
  }

  function updatePlayerName(newName: string, index: number) {
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers]
      newPlayers[index].name = newName
      return newPlayers
    })
  }

  function allNamesFilled(): boolean {
    const nonEmptyNames = players().filter((player) => player.name.length > 0)
    return nonEmptyNames.length === numPlayers()
  }

  return (
    <div class="flex flex-col gap-y-10 h-screen items-center justify-center">
      <div class="flex gap-x-3 w-full items-center justify-center">
        <label
          class="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded"
          onClick={tryAndStartGame}
        >
          Number of players
        </label>
        <select
          class="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          onChange={(e: Event) =>
            updateNumberOfPlayers(
              Number.parseInt((e.currentTarget as HTMLOptionElement).value)
            )
          }
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>
      <div class="flex flex-col gap-y-2">
        <For each={new Array(numPlayers())}>
          {(_unused, index) => (
            <div class="flex gap-x-2 items-center justify-center">
              <label>Player {index() + 1}:</label>
              <input
                onChange={(e) =>
                  updatePlayerName(
                    (e.target as HTMLInputElement).value,
                    index()
                  )
                }
                class="shadow appearance-none border rounded py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
              >
                {players()[index()].name}
              </input>
              <div
                class={`border border-black w-5 h-5 rounded ${playerColorToCss(
                  players()[index()].color
                )}`}
              />
            </div>
          )}
        </For>
        <button
          class={`self-center mt-4 max-w-max text-white font-semibold py-2 px-4 rounded ${
            allNamesFilled()
              ? 'bg-blue-500 hover:bg-blue-700'
              : 'bg-gray-500 hover:bg-gray-700'
          }`}
          disabled={!allNamesFilled()}
          onClick={tryAndStartGame}
        >
          Start game
        </button>
      </div>
    </div>
  )
}

export default ConfigureLocalPlayers
