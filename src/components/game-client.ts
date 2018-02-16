import {SteerCommand} from "./model/steer-command";
import {connect, MqttClient} from "mqtt";

export class GameClient {

    private mqtt: MqttClient;
    private lastCourse: string;

    constructor(brokerUrl: string) {
        this.mqtt = connect(brokerUrl);
    }

    initClientKeyboardControls(instanceName: string, playerId: string, playerToken: string): void {
        window.addEventListener('keyup', (event) => {
            const key = event.which || event.keyCode;
            let course = 'N';

            switch (key) {
                case 37: course = 'W'; break;
                case 38: course = 'N'; break;
                case 39: course = 'E'; break;
                case 40: course = 'S'; break;
            }
            this.steer(instanceName,playerId, playerToken, course);
        });
    }

    private buildSteerTopic(instanceName: string, playerId: string): string {
        return 'traze/' + instanceName + '/' + playerId + '/steer';
    }

    private steer(instanceName: string, playerId: string, playerToken: string, course: string): void {
        if(!((course === 'N' && this.lastCourse === 'S') ||
            (course === 'S' && this.lastCourse === 'N') ||
            (course === 'E' && this.lastCourse === 'W') ||
            (course === 'W' && this.lastCourse === 'E'))) {

            this.lastCourse = course;
            this.mqtt.publish(this.buildSteerTopic(instanceName, playerId), JSON.stringify(new SteerCommand(course, playerToken)));
        }
    }
}
