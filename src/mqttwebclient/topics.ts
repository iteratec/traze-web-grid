const topics = {
  gamesTopic: () => 'traze/games',
  gridTopic: (instanceName: string) => `traze/${instanceName}/grid`,
  playerTopic: (instanceName: string) => `traze/${instanceName}/players`,
  tickerTopic: (instanceName: string) => `traze/${instanceName}/ticker`
}

export default topics;
