import {CanvasSettings} from "./model/canvas-settings";
import {Coordinate} from "./model/coordinate";

/**
 * Bike trail service. Provides functionality to calculate the bike trail coordinates on the canvas grid.
 */
export class PositionCalculationService {

    constructor() {
    }

    /**
     * Calculates the position with respect to the calculated distance between tail sections and the gap to the
     * field borders.
     * @param {number[]} location the current location
     * @param {Coordinate} stepLength the distance between tail sections
     * @param {Coordinate} offset the gap to field borders
     * @param {CanvasSettings} settings the canvas settings
     * @returns {Coordinate} the coordinate as position
     */
    calculatePosition(location: number[], stepLength: Coordinate, offset: Coordinate, settings: CanvasSettings) {
        return new Coordinate((location[0] * stepLength.x + offset.x), settings.height - (location[1] * stepLength.y + offset.y));
    }

    /**
     * Calculates the center position of two positions.
     * @param {Coordinate} father the father position
     * @param {Coordinate} child the child position
     * @returns {Coordinate} the center position
     */
    calculateCenterPosition(father: Coordinate, child: Coordinate): Coordinate {
        return new Coordinate((father.x + child.x) / 2, (father.y + child.y) / 2);
    }
}
