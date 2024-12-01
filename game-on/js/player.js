class Player {
    constructor(role, sets) {
        this.role = role;
        this.sets = sets/3;
        this.cards = [];
        for(let i=0; i<this.sets; i++) {
            this.cards.push(new Card(0));
            this.cards.push(new Card(1));
            this.cards.push(new Card(2));
        }
    }
}

class Card {
    constructor(type = "any") {
        // 0 = rock; 1 = paper; 2 = scissors.
        /*this.type = Math.floor(3*Math.random());*/
        this.type = type;
        switch(this.type) {
            case 0: this.image = "./images/rock.png"; this.name = "Rock"; break;
            case 1: this.image = "./images/paper.png"; this.name = "Paper"; break;
            case 2: this.image = "./images/scissors.png"; this.name = "Scissors"; break;
            case any: 
            let randomNum = this.type = Math.floor(3*Math.random());
            if(randomNum === 0) {
                this.image = "./images/rock.png"; 
                this.name = "Rock"; 
                break;
            } else if (randomNum === 1) {
                this.image = "./images/paper.png"; 
                this.name = "Paper"; 
                break;
            } else if (randomNum === 2) {
                this.image = "./images/scissors.png"; 
                this.name = "Scissors"; 
                break;
            } else {
                console.log(`randomNum error`);
            }
            default: this.image = "./images/error.png"; this.name = "Error"; break;
        }
    }
}

export { Player, Card };