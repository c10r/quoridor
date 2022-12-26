import type { Component } from 'solid-js'
import { Match, Switch, createSignal } from 'solid-js'
import { Player } from '../models/player'
import Board from './Board'
import ConfigureLocalPlayers from './ConfigureLocalPlayers'
import Lobby from './Lobby'

enum GamePhase {
  CHOOSE_GAME_TYPE,
  CONFIGURE_PLAYERS,
  GAME_IN_PROGRESS,
  GAME_OVER,
}

enum GameType {
  LOCAL,
  AI,
  ONLINE,
}

const Game: Component = () => {
  const [gameType, setGameType] = createSignal<GameType | undefined>()
  const [phase, setPhase] = createSignal(GamePhase.CHOOSE_GAME_TYPE)
  const [players, setPlayers] = createSignal<Player[] | undefined>()

  function startLocalGame() {
    setGameType(GameType.LOCAL)
    setPhase(GamePhase.CONFIGURE_PLAYERS)
  }

  function startGame(players: Player[]) {
    setPlayers(players)
    setPhase(GamePhase.GAME_IN_PROGRESS)
  }

  function gameOver() {
    setPlayers(undefined)
    setPhase(GamePhase.CHOOSE_GAME_TYPE)
  }

  return (
    <Switch>
      <Match when={phase() === GamePhase.CHOOSE_GAME_TYPE}>
        <Lobby chooseLocal={startLocalGame} />
      </Match>
      <Match when={phase() === GamePhase.CONFIGURE_PLAYERS}>
        <ConfigureLocalPlayers startGame={startGame} />
      </Match>
      <Match when={phase() === GamePhase.GAME_IN_PROGRESS}>
        <Board gameOver={gameOver} playersProp={players()} />
      </Match>
      <Match when={phase() === GamePhase.GAME_OVER}>
        <h1>Game Over</h1>
      </Match>
    </Switch>
  )
}

export default Game
