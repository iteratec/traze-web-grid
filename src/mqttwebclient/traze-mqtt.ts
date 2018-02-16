import { connect, MqttClient } from 'mqtt'
import topics from './topics'
import {
  MessagePayload,
  GamesPayload,
  GridPayload,
  PlayersPayload,
  TickPayload,
  Game
} from './types'

export type MessageHandlers = {
  onGridMessage: (gridInfo: GridPayload) => void
  onPlayersMessage: (playersInfo: PlayersPayload) => void
  onTickerMessage: (tickerInfo: TickPayload) => void
}

export interface TrazeSubscription {
  instanceName: string
  handlers: MessageHandlers
}

export interface TrazeProps {
  brokerUrl: string
  onGamesHandler: (gamesInfo: GamesPayload) => void
}

export class TrazeMQTTClass {
  private client: MqttClient

  constructor(props: TrazeProps) {
    this.client = connect(props.brokerUrl)
    this.client.on('connect', () => {
      this.subscribeToGames(props.onGamesHandler)
    })
  }

  /**
   * Subscribe to the specified game instance with the provided message handlers.
   */
  public setupGameSubscription = (subscriptionProps: TrazeSubscription) => {
    this.subscribeToGame(subscriptionProps.instanceName)
    this.subscribeToPlayers(subscriptionProps.instanceName)
    this.subscribeToTicker(subscriptionProps.instanceName)
    this.registerHandlers(subscriptionProps)
  }

  private subscribeToGames = (onGamesHandler: (gamesPayload: GamesPayload) => void) => {
    this.client.subscribe(topics.gamesTopic())
    this.client.on('message', (topic: string, payload: string) => {
      if (topic === topics.gamesTopic()) {
        onGamesHandler(JSON.parse(payload) as GamesPayload)
      }
    })
  }

  private registerHandlers = (subscriptionProps: TrazeSubscription) => {
    this.client.on('message', (topic: string, payload: string) => {
      switch (topic) {
        case topics.gridTopic(subscriptionProps.instanceName):
          subscriptionProps.handlers.onGridMessage(JSON.parse(payload) as GridPayload)
          break
        case topics.playerTopic(subscriptionProps.instanceName):
          subscriptionProps.handlers.onPlayersMessage(JSON.parse(payload) as PlayersPayload)
          break
        case topics.tickerTopic(subscriptionProps.instanceName):
          subscriptionProps.handlers.onTickerMessage(JSON.parse(payload) as TickPayload)
          break
        default:
          console.log('Received message on topic ' + topic + ', but there is no handler defined.')
          return
      }
    })
  }

  private subscribeToGame = (instanceName: string) => {
    this.client.subscribe(topics.gridTopic(instanceName))
  }

  private subscribeToPlayers = (instanceName: string) => {
    this.client.subscribe(topics.playerTopic(instanceName))
  }

  private subscribeToTicker = (instanceName: string) => {
    this.client.subscribe(topics.tickerTopic(instanceName))
  }
}

/**
 * Creates and returns a new instance of the TrazeMQTTClass.
 * @param {TrazeProps} props
 */
const TrazeMQTT = (props: TrazeProps) => new TrazeMQTTClass(props)

export default TrazeMQTT
