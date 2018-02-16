import {GameState} from "./model/game.state";
import {Player} from "./model/player";
import {Coordinate} from "./model/coordinate";
import {Bike, Position} from "../mqttwebclient/types";
import {CanvasSettings} from "./model/canvas-settings";
import {BikeTrailService} from "./bike-trail.service";
import {PositionCalculationService} from "./position-calculation.service";

/**
 * The game state drawer service. Draws the complete game state to the canvas.
 */
export class GameStateDrawerService {

    private defaultPlayerColor = '#0A94FF';
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private bikeTrailService: BikeTrailService;
    private calcService: PositionCalculationService;

    /**
     * Creates the game state drawer.
     * @param {HTMLCanvasElement} canvas the canvas element
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvasContext = this.getCanvasContext(canvas);
        this.calcService = new PositionCalculationService();
        this.bikeTrailService = new BikeTrailService(this.calcService);
    }

    /**
     * Draws the game state to the canvas.
     * @param {GameState} gameState the game state
     * @param {Player[]} players the player list
     * @param {Coordinate} stepLength the distance between two tail sections
     * @param {Coordinate} offset the gap to the field borders
     * @param {number} animationOffset the offset for calculate the tail animation
     * @param {CanvasSettings} settings the canvas settings
     */
    draw(gameState: GameState, players: Player[], stepLength: Coordinate, offset: Coordinate,
         animationOffset: number, settings: CanvasSettings): void {

        this.clear(this.canvas, this.canvasContext);
        this.initCanvasStyle(this.canvasContext, offset, animationOffset);
        gameState.bikes.forEach(bike => {
            this.drawBike(bike, this.findPlayerById(players, bike.playerId), this.canvasContext, stepLength, offset, settings);
        });

        if (gameState.spawns) {
            gameState.spawns.forEach(spawn => {
                this.drawSpawn(spawn, this.canvasContext, offset, stepLength, settings);
            });
        }
    }

    /**
     * Returns the canvas context.
     * @param {HTMLCanvasElement} canvas the canvas element
     * @returns {CanvasRenderingContext2D} the canvas context
     */
    private getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        let ctx;
        if (canvas.getContext) {
            ctx = canvas.getContext("2d");
        }
        return ctx;
    }

    /**
     * Returns the player details corresponds to the player id.
     * @param {Player[]} players the list of players
     * @param {number} playerId the player id searching for
     * @returns {Player} the player or undefined if not exists
     */
    private findPlayerById(players: Player[], playerId: number): Player {
        return players.filter(player => {
            return player.id === playerId;
        })[0];
    }

    /**
     * Initializes the canvas styling.
     * @param {CanvasRenderingContext2D} canvasContext the canvas context
     * @param {Coordinate} offset the gap to field borders
     * @param {number} animationOffset the animation offset
     */
    private initCanvasStyle(canvasContext: CanvasRenderingContext2D, offset: Coordinate, animationOffset: number) {
        canvasContext.lineWidth = offset.x;
        canvasContext.setLineDash([offset.x / 4, offset.x / 4]);
        canvasContext.shadowOffsetX = 0;
        canvasContext.shadowOffsetY = 0;
        canvasContext.shadowBlur = offset.x / 2;
        canvasContext.lineDashOffset = -animationOffset
    }

    /**
     * Initializes the color scheme for player.
     * @param {Player} player the player
     * @param {CanvasRenderingContext2D} canvasContext the canvas context
     */
    private initColorScheme(player: Player, canvasContext: CanvasRenderingContext2D) {
        canvasContext.strokeStyle = (player) ? player.color : this.defaultPlayerColor;
        canvasContext.shadowColor = (player) ? player.color : this.defaultPlayerColor;
        canvasContext.fillStyle = (player) ? player.color : this.defaultPlayerColor;
    }


    /**
     * Draws the bike and the complete tail.
     * @param {Bike} bike the bike
     * @param {Player} player the player details
     * @param {CanvasRenderingContext2D} canvasContext the canvas context
     * @param {Coordinate} stepLength the distance between tail sections
     * @param {Coordinate} offset the gap to field borders
     * @param {CanvasSettings} settings the canvas settings
     */
    private drawBike(bike: Bike, player: Player, canvasContext: CanvasRenderingContext2D, stepLength: Coordinate, offset: Coordinate, settings: CanvasSettings) {
        this.initColorScheme(player, canvasContext);

        let startPosition = this.calcService.calculatePosition(bike.currentLocation, stepLength, offset, settings);
        const coordinateTrail = this.bikeTrailService.calculateBikeTrail(bike.trail, stepLength, offset, settings);
        this.drawHead(bike.direction, startPosition, canvasContext, offset);
        canvasContext.beginPath();
        canvasContext.moveTo(startPosition.x, startPosition.y);
        canvasContext.lineTo(this.calcService.calculateCenterPosition(startPosition, coordinateTrail[0]).x,
            this.calcService.calculateCenterPosition(startPosition, coordinateTrail[0]).y);

        let oldPos = startPosition;
        coordinateTrail.forEach((position: Coordinate, index: number) => {

            const nextPos = this.getElementOrNull(coordinateTrail, index + 1);
            if (nextPos) {
                if (this.directionChanged(oldPos, nextPos)) {
                    // curve
                    canvasContext.quadraticCurveTo(position.x, position.y,
                        this.calcService.calculateCenterPosition(position, nextPos).x,
                        this.calcService.calculateCenterPosition(position, nextPos).y)
                } else {
                    // line
                    canvasContext.lineTo(this.calcService.calculateCenterPosition(position, nextPos).x,
                        this.calcService.calculateCenterPosition(position, nextPos).y);
                }
            } else {
                canvasContext.lineTo(position.x, position.y);
                this.expandStartField(position, oldPos, offset, canvasContext);
            }
            oldPos = position;
        });
    }

    /**
     * Expand first field of the trail to fill the complete field.
     * @param {Coordinate} lastPos the last position of the trail
     * @param {Coordinate} preLastPos the pre last position of the trail
     * @param {Coordinate} offset the field offset
     * @param {CanvasRenderingContext2D} canvasContext the canvas context
     */
    private expandStartField = (lastPos: Coordinate, preLastPos: Coordinate, offset: Coordinate, canvasContext: CanvasRenderingContext2D) => {
        if (preLastPos.x < lastPos.x) {
            canvasContext.lineTo(lastPos.x + offset.x, lastPos.y);
        } else if (preLastPos.x > lastPos.x) {
            canvasContext.lineTo(lastPos.x - offset.x, lastPos.y);
        } else if (preLastPos.y > lastPos.y) {
            canvasContext.lineTo(lastPos.x, lastPos.y - offset.y);
        } else if (preLastPos.y < lastPos.y) {
            canvasContext.lineTo(lastPos.x, lastPos.y + offset.y);
        }
        canvasContext.stroke();
    };

    /**
     * Draws the spawn points to the canvas.
     * @param {Position} spawn the spawn point
     * @param {CanvasRenderingContext2D} canvasContext the canvas context
     * @param {Coordinate} offset the field offset
     * @param {Coordinate} stepLength the step length
     * @param {CanvasSettings} settings the canvas settings
     */
    private drawSpawn(spawn: Position, canvasContext: CanvasRenderingContext2D, offset: Coordinate, stepLength: Coordinate, settings: CanvasSettings) {
        canvasContext.beginPath();
        canvasContext.arc(
            this.calcService.calculatePosition(spawn, stepLength, offset, settings).x,
            this.calcService.calculatePosition(spawn, stepLength, offset, settings).y,
            offset.x / 3, 0, 2 * Math.PI);
        canvasContext.fillStyle = '#ffffff';
        canvasContext.shadowColor = '#ffffff';
        canvasContext.fill();
    }

    /**
     * Returns coordinate from the coordinate list or null if not exists.
     * @param {Coordinate[]} array the coordinate list
     * @param {number} index the index searched for
     * @returns {Coordinate} the coordinate or null
     */
    private getElementOrNull(array: Coordinate[], index: number): Coordinate {
        return (array.length > index) ? array[index] : undefined;
    }

    /**
     * Draws the bike head.
     * @param {string} course the current course
     * @param {Coordinate} startPosition the start position
     * @param {CanvasRenderingContext2D} canvasContext the canvas context
     * @param {Coordinate} offset the gap to field borders
     */
    private drawHead(course: string, startPosition: Coordinate, canvasContext: CanvasRenderingContext2D, offset: Coordinate) {
        let direction = '';
        canvasContext.beginPath();
        if (course === 'N') {
            canvasContext.moveTo(startPosition.x, startPosition.y - offset.y);
            canvasContext.lineTo(startPosition.x + offset.x, startPosition.y);
            canvasContext.lineTo(startPosition.x - offset.x, startPosition.y);
            direction = 'N'
        } else if (course === 'E') {
            canvasContext.moveTo(startPosition.x + offset.x, startPosition.y);
            canvasContext.lineTo(startPosition.x, startPosition.y + offset.y);
            canvasContext.lineTo(startPosition.x, startPosition.y - offset.y);
            direction = 'E';
        } else if (course === 'W') {
            canvasContext.moveTo(startPosition.x - offset.x, startPosition.y);
            canvasContext.lineTo(startPosition.x, startPosition.y + offset.y);
            canvasContext.lineTo(startPosition.x, startPosition.y - offset.y);
            direction = 'W';
        } else if (course === 'S') {
            canvasContext.moveTo(startPosition.x, startPosition.y + offset.y);
            canvasContext.lineTo(startPosition.x + offset.x, startPosition.y);
            canvasContext.lineTo(startPosition.x - offset.x, startPosition.y);
            direction = 'S';
        } else {
            console.log('Hmmm!');
        }
        canvasContext.fill();
        return direction;
    }

    /**
     * Checks if the direction changed.
     * @param {Coordinate} oldPos the old position
     * @param {Coordinate} newPos the new position
     * @returns {boolean} true if direction changed, false else
     */
    private directionChanged(oldPos: Coordinate, newPos: Coordinate) {
        if (newPos) {
            return oldPos.x !== newPos.x && oldPos.y !== newPos.y;
        }
        return false;
    }

    /**
     * Clears the canvas element.
     * @param {HTMLCanvasElement} canvas the canvas element
     * @param {CanvasRenderingContext2D} canvasContext the canvas context
     */
    private clear(canvas: HTMLCanvasElement, canvasContext: CanvasRenderingContext2D) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }
}
