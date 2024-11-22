class Player {
    constructor(code, sets) {
        this.code = code;
        this.sets = sets;
        this.cards = [];
        for(i=0; i<sets; i++) {
            this.cards.append(new Card());
        }
    }
}

class Card {
    constructor() {
        // 0 = rock; 1 = paper; 2 = scissors.
        this.type = Math.floor(3*Math.random());
        switch(this.type) {
            case 0: this.image = "../images/rock.png"; break;
            case 1: this.image = "../images/paper.png"; break;
            case 2: this.image = "../images/scissors.png"; break;
            default: this.image = "../images/error.png"; break;
        }
    }
}

export { Player, Card };