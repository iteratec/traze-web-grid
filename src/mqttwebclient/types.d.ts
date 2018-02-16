export interface Game {
    name: string;
    activePlayers: number;
}
export declare type GamePayload = Array<Game>;
export interface Player {
    id: number;
    name: string;
    color: string;
    frags: number;
    owned: number;
}
export declare type PlayersPayload = Array<Player>;
export declare type Position = [number, number];
export declare type Direction = 'N' | 'E' | 'S' | 'W';
export interface Bike {
    playerId: number;
    currentLocation: Position;
    direction: Direction;
    trail: Array<Position>;
}
export interface GridPayload {
    height: number;
    width: number;
    tiles: Array<Array<number>>;
    bikes: Array<Bike>;
}
export interface TickPayload {
    type: 'frag';
    casulty: number;
    fragger: number;
}
export declare type MessagePayload = GamePayload | GridPayload | PlayersPayload | TickPayload;
