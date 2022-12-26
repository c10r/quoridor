import type { Component } from 'solid-js'

interface LobbyProps {
  chooseLocal: () => void
}

const Lobby: Component<LobbyProps> = ({ chooseLocal }) => {
  return (
    <div class="flex flex-grow flex-col gap-y-3 items-center justify-center w-full h-screen">
      <button
        class="max-w-max bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        onClick={chooseLocal}
      >
        Play with friends on this computer
      </button>
      <button
        class="max-w-max bg-gray-400 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
        disabled
      >
        Play online (Coming soon!)
      </button>
      <button
        class="max-w-max bg-gray-400 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
        disabled
      >
        Play against a computer (Coming soon!)
      </button>
    </div>
  )
}

export default Lobby
