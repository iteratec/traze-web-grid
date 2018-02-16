import TrazeMQTT from "../mqttwebclient/traze-mqtt";

/**
 * Game initializer. Initializes the game connection to the mqtt broker.
 */
export class GameInitializer {

    constructor() {}

    /**
     * Initialize the game, connect to mqtt broker and register handler on certain topics.
     * @param {string} brokerUrl the broker url
     * @param {string} instanceName the instance name
     * @param {Function} gridCallback the callback called if grid message received
     * @param {Function} playersCallback the callback called if players message received
     */
    initialize(brokerUrl: string, instanceName: string, gridCallback: Function, playersCallback: Function): void {
        const client = TrazeMQTT({
            brokerUrl: brokerUrl,
            onGamesHandler: () => console.log('Retrieve games message.')
        });
        client.setupGameSubscription({
                instanceName: instanceName,
                handlers: {
                    onGridMessage: (msg) => gridCallback(msg),
                    onPlayersMessage: (msg) => playersCallback(msg),
                    onTickerMessage: () => console.log('Retrieve ticker message.')
                }
            }
        );
    }
}
