import {GridState} from "./model/grid.state";
import {Player} from "./model/player";
import {GameState} from "./model/game.state";

/**
 * Grid state service. Encapsulates the grid state with newest feeds received via mqtt.
 */
export class GridStateService {

    private gridState: GridState;

    /**
     * Creates the grid state service.
     */
    constructor() {
        this.gridState = new GridState([], null);
    }

    /**
     * Returns the list of known players.
     * @returns {Player[]} the players
     */
    getPlayers(): Player[] {
        return this.gridState.players;
    }

    /**
     * Sets a new list of players.
     * @param {Player[]} players the new player list
     */
    setPlayers(players: Player[]): void {
        this.gridState.players = players;
    }

    /**
     * Returns the current game state with details about bike positions and tails.
     * @returns {GameState} the game state
     */
    getGameState(): GameState {
        return this.gridState.gameState;
    }

    /**
     * Sets a new game state.
     * @param {GameState} gameState the new game states
     */
    setGameState(gameState: GameState): void {
        this.gridState.gameState = gameState;
    }
}
