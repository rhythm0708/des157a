import { role, sendMoveToFirebase, listenForBothPlayersMoves } from "./database.js";
import { updateStatus } from "./display.js";

// Home screen elements.
const actionsContainer = document.querySelector("#actions");
const rulesContainer = document.querySelector("#rules-container");
const taglineText = document.querySelector("#tagline").firstElementChild;
const taglineCount = document.querySelector("#tagline").lastElementChild;

// Timer.
let counter = 6;

// Game elements.
const gameScreen = document.querySelector("#game-overlay");
const hand = document.querySelector("#hand");
let cards = document.querySelectorAll(".card");
const confirmMove = document.querySelector("#confirm");

// Sound.
const soundIcon = document.querySelector("#sound-icon");
const soundtrack = new Audio("sounds/epic-music.mp3"); 
const explosion = new Audio("sounds/explosion.mp3");
const hit = new Audio("sounds/hit.mp3");
const clash = new Audio("sounds/sword-clash.mp3");
let musicPlaying = false;

// Game data.
let selectedMove = 2;
let playerData;
let playerRole = "";

let cardCount = 6;
let oppCardCount = 6;

// HOST is rows; GUEST is columns. 
const matchUps = [[0, -1, 1],
                [1, 0, -1],
                [-1, 1, 0]];

// Setup Game variables.
function startGame(players) {
    actionsContainer.style.display = "none";
    rulesContainer.style.display = "none";

    // Setup game.
    setupGame(players);

    // Timer.
    taglineText.innerHTML = "Starting game in";
    taglineCount.innerHTML = parseInt(counter)-1;
    countDown(counter);
}

function countDown(counter) {
    setTimeout(function(){
        if(counter > 1) {
            counter--;
            rotateEllipsis();
            taglineCount.innerHTML = parseInt(counter)-1;
            countDown(counter);
        } else {
            gameScreen.style.display = "inline";
            // TODO: OTHER START SETTINGS.
        }
    }, 1000);
}

async function setupGame(players) {
    playerRole = role;
    for(const player of players) {
        if(playerRole == player.role) {
            playerData = player;
            listenForBothPlayersMoves(role);
            fillHand(player.cards);
        } else if(playerRole == "host" || playerRole == "guest") {
            continue;
        } else {
            alert(`You are assigned the role of ${player.role} which is invalid.`);
        }
    }
    console.log(role);

    // Start music (no volume).
    soundtrack.loop = true;
    soundtrack.volume = 0;
    explosion.volume = 0.5;
    soundtrack.play();
}

confirmMove.addEventListener("click", function(e) {
    e.preventDefault();

    let selection = identifySelectedCard();
    if(selection) {
        selectedMove = selection;
        
        // Send signal to other player through firebase.
        sendMoveToFirebase(role, selection);
    } else {
        alert("You have not selected a card.");
    }
});

soundIcon.addEventListener("click", function() {
    musicPlaying = !musicPlaying;
    musicPlaying == true ? soundtrack.volume = 0.8 : soundtrack.volume = 0;
});

function rotateEllipsis() {
    taglineText.innerHTML += ".";

    if(taglineText.innerHTML.slice(-4) == "....") {
        taglineText.innerHTML = "Starting game in.";
    }
}

function fillHand(cards) {
    // Empty hand.
    hand.innerHTML = "";

    // Fill hand with appropriate cards.
    for(let card of cards) {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        const img = document.createElement("img");
        img.src = card.image;
        img.alt = card.name;

        const p = document.createElement("p");
        p.textContent = card.name;

        cardDiv.appendChild(img);
        cardDiv.appendChild(p);

        hand.appendChild(cardDiv);
    }

    // Add event listeners.
    cards = document.querySelectorAll(".card");
    cards.forEach(card => card.addEventListener("click", function() {
        cards.forEach(card => card.classList.remove("selected"));
        card.classList.add("selected");
    }));
}

function identifySelectedCard() {
    cards = document.querySelectorAll(".card");
    for(let card of cards) {
        if(card.classList.contains("selected")) {
            return card;
        } 
    }
    return null;
}

// 0 = tie; 1 = host win; -1 = guest win
function checkResult(hostMove, guestMove) {
    console.log(hostMove);
    console.log(guestMove);
    return matchUps[hostMove][guestMove];
}

function handleGame(result) {
    switch(playerRole) {
        case "host":
            if([1,0,-1].includes(result)) {
                console.log(host);
                return result;
            } else {
                alert(`${result} error`);
                return 0;
            }
        case "guest":
            if([1,0,-1].includes(result)) {
                console.log(guest);
                return (result * -1);
            } else {
                alert(`${result} error`);
                return 0;
            }
        default: alert("an error has occured"); break;
    }
}

// Check if either player has won.
function checkWin() {
    if(cardCount <= 0) {
        return "loss";
    } else if(oppCardCount <= 0) {
        return "win";
    }
    return false;
}

// Update card counts.
function gameDataUpdate(result) {
    if(result == -1) {
        cardCount -= 1;
        if(musicPlaying) {
            hit.play();
        }
    } else if(result == 1) {
        oppCardCount -= 1;
        if(musicPlaying) {
            explosion.play();
        }
    }  else if(result == 0) {
        if(musicPlaying) {
            clash.play();
        }
    }

    return [cardCount, oppCardCount];
}

function setupRound() {

}

// Export.
export { startGame, checkResult, handleGame, checkWin, gameDataUpdate, setupRound };