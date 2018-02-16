import { MqttClient } from 'mqtt';
import { GamePayload, GridPayload, PlayersPayload, TickPayload } from './types';
export declare type MessageHandlers = {
    onGameMessage: (gameInfo: GamePayload) => void;
    onGridMessage: (gridInfo: GridPayload) => void;
    onPlayersMessage: (playersInfo: PlayersPayload) => void;
    onTickerMessage: (tickerInfo: TickPayload) => void;
};
export interface TrazeMQTTProps {
    brokerURL: string;
    handlers: MessageHandlers;
}
export declare class TrazeMQTTClass {
    handlers: MessageHandlers;
    instanceName: any;
    client: MqttClient;
    brokerUrl: string;
    constructor(args: TrazeMQTTProps);
    setupGameSubscription: (instanceName: string) => void;
    private registerHandlers;
    private subscribeToGames;
    private subscribeToGame;
    private subscribeToPlayers;
    private subscribeToTicker;
}
declare const TrazeMQTT: (props: TrazeMQTTProps) => TrazeMQTTClass;
export default TrazeMQTT;
