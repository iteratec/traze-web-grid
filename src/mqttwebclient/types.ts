// Game
export interface Game {
  name: string
  activePlayers: number
}
export type GamesPayload = Array<Game>

// Player
export interface Player {
  id: number
  name: string
  color: string
  frags: number
  owned: number
}
export type PlayersPayload = Array<Player>

// Position
export type Position = [number, number]

// Direction
export type Direction = 'N' | 'E' | 'S' | 'W'

// Bike
export interface Bike {
  playerId: number
  currentLocation: Position
  direction: Direction
  trail: Array<Position>
}

// Grid
export interface GridPayload {
  height: number
  width: number
  tiles: Array<Array<number>>
  bikes: Array<Bike>
  spawns: Array<Position>
}

// Tick
export interface TickPayload {
  type: 'frag'
  casulty: number
  fragger: number
}

export type MessagePayload = GamesPayload | GridPayload | PlayersPayload | TickPayload
