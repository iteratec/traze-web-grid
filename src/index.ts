import {GameStateGridComponent} from "./components/game-state-grid.component";
import './styles.scss'
import {CanvasSettings} from "./components/model/canvas-settings";
import {GameInitializer} from "./components/game-initializer";
import {GridStateService} from "./components/grid-state.service";
import {GridPayload, PlayersPayload} from "./mqttwebclient/types";

// game ui settings
const settings: CanvasSettings = new CanvasSettings(window.innerWidth, window.innerHeight);

// init components and services
const gridStateService = new GridStateService();
const gameStateGrid = new GameStateGridComponent(settings, gridStateService);
setInterval(() => {
    gameStateGrid.drawGameGrid();
}, 17);

// gridCallback
const gridCallback = (msg: GridPayload) => {
    gridStateService.setGameState(msg);
};
const playersCallback = (msg: PlayersPayload) => {
    gridStateService.setPlayers(msg);
};

fetch('/app-configuration').then((response) => {
    return response.json();
}).then((configuration) => {
    // init mqtt client
    new GameInitializer().initialize(configuration.brokerUrl, configuration.instanceName, gridCallback, playersCallback);
}).catch((error) => {
    console.log('Failed to fetch configuration with %o', error);
});

