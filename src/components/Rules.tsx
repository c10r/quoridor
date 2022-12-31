import type { Component } from 'solid-js'

const Rules: Component = () => {
  return (
    <div class="flex flex-col justify-center items-center w-full">
      <h2 class="text-lg font-semibold">Rules:</h2>
      <p>1. Cross to the opposite side before your opponents to win</p>
      <p>2. Place walls to make your opponent's path to the goal longer</p>
      <p>3. You cannot block a player's only remaining path to the goal</p>
      <p>
        4. You <em>must</em> either move or place a wall. No skipping of turns
      </p>
    </div>
  )
}

export default Rules
