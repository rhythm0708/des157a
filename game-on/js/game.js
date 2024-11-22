// Home screen elements.
const actionsContainer = document.querySelector("#actions");
const rulesContainer = document.querySelector("#rules-container");
const taglineText = document.querySelector("#tagline").firstElementChild;
const taglineCount = document.querySelector("#tagline").lastElementChild;

// Timer.
let counter = 6;

// Game elements.
const gameScreen = document.querySelector("#game-overlay");

// Game data.
const gameManager = {

};

function startGame() {
    actionsContainer.style.display = "none";
    rulesContainer.style.display = "none";

    // Timer.
    taglineText.innerHTML = "Starting game in";
    taglineCount.innerHTML = parseInt(counter)-1;
    countDown();
}

function countDown() {
    console.log(`running countDown ${counter} time(s)`);
    setTimeout(function(){
        if(counter > 1) {
            counter--;
            rotateEllipsis();
            taglineCount.innerHTML = parseInt(counter)-1;
            countDown();
        } else {
            gameScreen.style.display = "inline";
            // TODO: OTHER START SETTINGS.
        }
    }, 1000);
}

function rotateEllipsis() {
    taglineText.innerHTML += ".";

    if(taglineText.innerHTML.slice(-4) == "....") {
        taglineText.innerHTML = "Starting game in.";
    }
}

// Export.
export { startGame };