import {Bike, GridPayload, Position} from "../../mqttwebclient/types";

export class GameState implements GridPayload {

    height: number;
    width: number;
    tiles: number[][];
    bikes: Bike[];
    spawns: Position[];

    constructor(height: number, width: number, bikes: Bike[], spawns: Position[]) {
        this.height = height;
        this.width = width;
        this.bikes = bikes;
        this.spawns = spawns;
    }
}
