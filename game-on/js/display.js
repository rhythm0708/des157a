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
    const resultsOverlay = document.querySelector("#results-overlay");

    // Elements.
    let cards = document.querySelectorAll(".card");
    let winLossResult = document.querySelector("#result");
    let finalScore = document.querySelector("#score");

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

        // Disable all actions.
        confirmMove.classList.add("inactive");
        confirmMove.disabled = "true";

        cards = document.querySelectorAll(".card");
        cards.forEach(card => card.classList.add("inactive"));
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
function gameUIUpdate(result, cardCounts) {
    // Update values and cards.
    let playerCardCount = document.querySelector("#player-count");
    let oppCardCount = document.querySelector("#opp-count");

    if (result === 1) {
        serverStatus.textContent = "You won that interaction!";
        oppCardCount.textContent = cardCounts[1];
    } else if(result === -1) {
        serverStatus.textContent = "You lost that interaction.";
        playerCardCount.textContent = cardCounts[0];

        // Remove dead card.
        let selectedCard = document.querySelector(".card.selected");
        selectedCard.remove();
    } else if (result === 0) {
        serverStatus.textContent = "It was a draw.";
    }
}

function unlockCards() {
    // Re-enable actions.
    let confirmMove = document.querySelector("#confirm");
    confirmMove.classList.remove("inactive");
    confirmMove.disabled = false;
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => card.classList.remove("inactive"));

    // Deselect card.
    let selectedCard = document.querySelector(".card.selected");
    selectedCard.classList.remove("selected");
}

// FUNCTION: Flash the win screen with the appropriate score.
function displayEndScreen(result, cardCounts) {
    resultsOverlay.style.display = "inline";

    // Adjust text based on result.
    if(result == "win") {
        winLossResult.textContent = "You won!";
        finalScore.textContent = `${cardCounts[0]} – ${cardCounts[1]}`;
    } else if(result == "loss") {
        winLossResult.textContent = "You lose.";
        finalScore.textContent = `${cardCounts[0]} – ${cardCounts[1]}`;
    }
}
export { updateStatus, gameUIUpdate, unlockCards, displayEndScreen };