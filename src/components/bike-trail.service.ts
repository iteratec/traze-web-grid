import {CanvasSettings} from "./model/canvas-settings";
import {Coordinate} from "./model/coordinate";
import {PositionCalculationService} from "./position-calculation.service";

/**
 * Bike trail service. Provides functionality to calculate the bike trail coordinates on the canvas grid.
 */
export class BikeTrailService {

    private calcService: PositionCalculationService;

    constructor(calculationService: PositionCalculationService) {
        this.calcService = calculationService;
    }

    /**
     * Calculates the bike trail coordinate on the canvas.
     * @param {number[][]} trail the current location
     * @param {Coordinate} stepLength the distance between tail sections
     * @param {Coordinate} offset the gap to field borders
     * @param {CanvasSettings} settings the canvas settings
     * @returns {Coordinate[]} the coordinates
     */
    calculateBikeTrail(trail: number[][], stepLength: Coordinate, offset: Coordinate, settings: CanvasSettings): Coordinate[] {
        return trail.map((entry) => {
            return this.calcService.calculatePosition(entry, stepLength, offset, settings)
        });
    }
}
