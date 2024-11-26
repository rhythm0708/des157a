(function(){
    "use strict";
    console.log("reading js");

    // Buttons.
    const showRules = document.querySelector("#rules-button");
    const closeRules = document.querySelector("#close-rules");
    const soundIcon = document.querySelector("#sound-icon");
    let confirmMove = document.querySelector("#confirm");
    const playAgain = document.querySelector("#play-again");
    const returnToTile = document.querySelector("#return-to-title");

    // Overlays.
    const rulesOverlay = document.querySelector("#rules-overlay");
    let resultsOverlay = document.querySelector("#results-overlay");

    // Elements.
    let cards = document.querySelectorAll(".card");

    showRules.addEventListener("click", function() {
        rulesOverlay.style.display = "inline";
    });

    closeRules.addEventListener("click", function() {
        rulesOverlay.style.display = "none";
    });

    // ACTION: TOGGLE MUSIC
    soundIcon.addEventListener("click", function() {
        soundIcon.src = soundIcon.src.endsWith("no-sound.png") ? "images/sound.png" : "images/no-sound.png";
    });

    // ACTION: SELECT CARD
    cards.forEach(card => card.addEventListener("click", function() {
        // this check doesn't seem to work.
        if (!card.classList.contains("inactive")) {
            // Remove 'selected' class from all cards.
            cards.forEach(card => card.classList.remove("selected"));

            // Add 'selected' class to card.
            card.classList.add("selected");
        }
    }));

    // ACTION: CONFIRM MOVE
    confirmMove.addEventListener("click", function(e) {
        e.preventDefault();
        let selection = false;
        cards = document.querySelectorAll(".card");
        for(let card of cards) {
            if(card.classList?.contains("selected")) {
                selection = true;
            } 
        }

        // Disable all actions.
        if(selection) {
            confirmMove.classList.add("inactive");
            confirmMove.disabled = "true";

            cards = document.querySelectorAll(".card");
            cards.forEach(card => card.classList.add("inactive"));
        }
    });

    // ACTION: Play again.
    playAgain.addEventListener("click", function(e) {
        e.preventDefault();
        alert("Play again");
    });

    // ACTION: Return to Title.
    returnToTile.addEventListener("click", function(e) {
        e.preventDefault();
        location.reload();
    });
})();

// Data elements.
const serverStatus = document.querySelector("#server-message");

// FUNCTION: Update system status.
function updateStatus(update) {
    if(update === "oppMove") {
        serverStatus.textContent = "Your opponent has made their move.";
    } else if(update === "playerMove") {
        serverStatus.textContent = "Waiting for opponent's move...";
    } else if(update === "newRound") {
        serverStatus.textContent = "Select a move to use against your opponent.";
    }
}

// FUNCTION: Update after game.
async function gameUIUpdate(result, cardCounts) {
    const resolvedCardCounts = await cardCounts;
    // Update values and cards.
    let playerCardCount = document.querySelector("#player-count");
    let oppCardCount = document.querySelector("#opp-count");

    if (result === 1) {
        serverStatus.textContent = "You won that interaction!";
        oppCardCount.textContent = resolvedCardCounts[1];
    } else if(result === -1) {
        serverStatus.textContent = "You lost that interaction.";
        playerCardCount.textContent = resolvedCardCounts[0];

        // Remove dead card.
        let selectedCard = document.querySelector(".card.selected");
        selectedCard?.remove();
    } else if (result === 0) {
        serverStatus.textContent = "It was a draw.";
    }
}

function unlockCards() {
    // Re-enable actions.
    let confirmMove = document.querySelector("#confirm");
    confirmMove.classList?.remove("inactive");
    confirmMove.disabled = false;
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => card.classList?.remove("inactive"));

    // Deselect card.
    let selectedCard = document.querySelector(".card.selected");
    if(selectedCard) {
        selectedCard.classList?.remove("selected");
    }   
}

// FUNCTION: Flash the win screen with the appropriate score.
async function displayEndScreen(result, cardCounts) {
    let resultsOverlay = document.querySelector("#results-overlay");
    resultsOverlay.style.display = "inline";
    const resolvedCardCounts = await cardCounts;

    // Adjust text based on result.
    let winLossResult = document.querySelector("#result");
    let finalScore = document.querySelector("#score");

    if(result == "win") {
        winLossResult.textContent = "You win!";
        finalScore.textContent = `${resolvedCardCounts[0]} – ${resolvedCardCounts[1]}`;
    } else if(result == "loss") {
        winLossResult.textContent = "You lose.";
        finalScore.textContent = `${resolvedCardCounts[0]} – ${resolvedCardCounts[1]}`;
    }
}

export { updateStatus, gameUIUpdate, unlockCards, displayEndScreen };