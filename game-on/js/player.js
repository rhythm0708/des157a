class Player {
    constructor(role, sets) {
        this.role = role;
        this.sets = sets;
        this.cards = [];
        for(let i=0; i<sets; i++) {
            this.cards.push(new Card());
        }
    }
}

class Card {
    constructor() {
        // 0 = rock; 1 = paper; 2 = scissors.
        this.type = Math.floor(3*Math.random());
        switch(this.type) {
            case 0: this.image = "./images/rock.png"; this.name = "Rock"; break;
            case 1: this.image = "./images/paper.png"; this.name = "Paper"; break;
            case 2: this.image = "./images/scissors.png"; this.name = "Scissors"; break;
            default: this.image = "./images/error.png"; this.name = "Error"; break;
        }
    }
}

export { Player, Card };