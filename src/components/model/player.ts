export class Player {

    id: number;
    name: string;
    color: string;
    frags: number;
    owned: number;

    constructor(id: number, name: string, color: string, frags: number, owned: number) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.frags = frags;
        this.owned = owned;
    }
}
