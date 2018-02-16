import {GameStateDrawerService} from "./game-state-drawer.service";
import {CanvasSettings} from "./model/canvas-settings";
import {Coordinate} from "./model/coordinate";
import {Player} from "./model/player";
import {GridPayload} from "../mqttwebclient/types";
import {GridStateService} from "./grid-state.service";

/**
 * Game state grid component. Encapsulates logic for drawing the canvas game grid and display bikes.
 */
export class GameStateGridComponent {

    private animationOffset: number = 0;
    private stepLength: Coordinate = new Coordinate(0, 0);
    private offset: Coordinate = new Coordinate(0, 0);
    private drawer: GameStateDrawerService;
    private gridStateService: GridStateService;
    private settings: CanvasSettings;
    private canvas: HTMLCanvasElement;
    private isInitialized: boolean;

    /**
     * Creates the game state grid component.
     * @param {CanvasSettings} canvasSettings the canvas settings
     * @param {GridStateService} gridStateService the grid state service
     */
    constructor(canvasSettings: CanvasSettings, gridStateService: GridStateService) {
        this.gridStateService = gridStateService;
        this.settings = canvasSettings;
        this.canvas = <HTMLCanvasElement>document.getElementById("traze-grid-canvas");
        this.registerFullscreenListener();
        this.drawGameGrid();
    }

    /**
     * Draws the game grid using current game state.
     */
    drawGameGrid() {
        if (this.gridStateService.getGameState()) {
            if (!this.isInitialized) {
                this.initCanvasAndVars(this.gridStateService.getGameState(), this.canvas);
                this.isInitialized = true;
            }
            this.runAnimation(this.gridStateService.getGameState(), this.canvas, this.gridStateService.getPlayers());
        }
        requestAnimationFrame(() => this.drawGameGrid);
    }

    /**
     * Initialize the canvas and necessary variables to calculate the bikes and their tails.
     * @param {GridPayload} gameState the grid layout and bike details
     * @param {HTMLCanvasElement} canvas the canvas element
     */
    private initCanvasAndVars(gameState: GridPayload, canvas: HTMLCanvasElement): void {
        canvas.width = this.settings.width;
        canvas.height = this.settings.height;
        this.stepLength.x = this.settings.width / gameState.width;
        this.stepLength.y = this.settings.height / gameState.height;
        this.offset.x = this.stepLength.x / 2;
        this.offset.y = this.stepLength.y / 2;
        this.drawer = new GameStateDrawerService(canvas);
        this.drawGridBackground();
    }

    /**
     * Runs the animation and redraw the current game state.
     * @param {GridPayload} gameState the game state
     * @param {HTMLCanvasElement} canvas the canvas element
     * @param {Player[]} players the player list
     */
    private runAnimation(gameState: GridPayload, canvas: HTMLCanvasElement, players: Player[]) {
        this.drawer.draw(gameState, players, this.stepLength, this.offset, this.animationOffset, this.settings);
    }

    /**
     * Registers a full screen listener to enter into full screen.
     */
    private registerFullscreenListener() {
        const body = <any>document.body;
        body.enableFullScreen = body.webkitRequestFullScreen || body.msRequestFullScreen || body.requestFullscreen || body.mozRequestFullScreen;
        body.addEventListener('mousedown', () => {
            if (body.enableFullScreen) {
                body.enableFullScreen();
            }
        });
    }

    /**
     * Draws the grid background to visible the field borders.
     */
    private drawGridBackground() {
        const backgroundCanvas = <HTMLCanvasElement>document.getElementById("traze-grid-background-canvas");
        const backgroundCanvasCtx = this.getCanvasContext(backgroundCanvas);

        backgroundCanvas.width = this.settings.width;
        backgroundCanvas.height = this.settings.height;

        backgroundCanvasCtx.beginPath();
        backgroundCanvasCtx.strokeStyle = '#db1ed1';
        backgroundCanvasCtx.shadowBlur = 5;
        backgroundCanvasCtx.shadowColor = '#ffffff';
        for (let i = 0; i < this.settings.height; i = i + this.stepLength.y) {
            backgroundCanvasCtx.moveTo(0, i);
            backgroundCanvasCtx.lineTo(this.settings.width, i);
        }
        for (let p = 0; p < this.settings.width; p = p + this.stepLength.x) {
            backgroundCanvasCtx.moveTo(p, 0);
            backgroundCanvasCtx.lineTo(p, this.settings.height);
        }

        backgroundCanvasCtx.moveTo(0,this.settings.height,);
        backgroundCanvasCtx.lineTo(this.settings.width, this.settings.height);
        backgroundCanvasCtx.lineTo(this.settings.width, 0);
        backgroundCanvasCtx.stroke();
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
}
