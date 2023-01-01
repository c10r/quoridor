import type { Component } from 'solid-js'
import { Routes, Route } from '@solidjs/router'
import Game from './Game'

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
    </Routes>
  )
}

export default App
