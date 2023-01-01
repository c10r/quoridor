import type { Component } from 'solid-js'
import { Routes, Route } from '@solidjs/router'
import Game from './Game'
import Monetag from './Monetag'

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/about" element={<Monetag />} />
    </Routes>
  )
}

export default App
