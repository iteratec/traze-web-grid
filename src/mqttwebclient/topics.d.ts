declare const topics: {
    gamesTopic: () => string;
    gridTopic: (instanceName: string) => string;
    playerTopic: (instanceName: string) => string;
    tickerTopic: (instanceName: string) => string;
};
export default topics;
