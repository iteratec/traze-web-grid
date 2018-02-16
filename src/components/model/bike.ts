import {Bike, Direction, Position} from "../../mqttwebclient/types";

export class BikeImpl implements Bike {

    playerId: number;
    direction: Direction;
    currentLocation: Position;
    trail: Position[];

    constructor(playerId: number, direction: Direction, currentLocation: Position, trail: Position[]) {
        this.playerId = playerId;
        this.direction = direction;
        this.currentLocation = currentLocation;
        this.trail = trail;
    }
}
