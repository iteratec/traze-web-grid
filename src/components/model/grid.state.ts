import {Player} from "../../mqttwebclient/types";
import {GameState} from "./game.state";

export class GridState {

    players: Player[];
    gameState: GameState;

    constructor(players: Player[], gameState: GameState) {
        this.players = players;
        this.gameState = gameState;
    }
}
