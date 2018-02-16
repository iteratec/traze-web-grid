export class SteerCommand {

    course: string;
    playerToken: string;

    constructor(course: string, playerToken: string) {
        this.course = course;
        this.playerToken = playerToken;
    }
}
