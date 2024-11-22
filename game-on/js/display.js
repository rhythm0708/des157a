(function(){
    "use strict";
    console.log("reading js");

    // Buttons.
    const showRules = document.querySelector("#rules-button");
    const closeRules = document.querySelector("#close-rules");
    const soundIcon = document.querySelector("#sound-icon");

    // Overlays.
    const rulesOverlay = document.querySelector("#rules-overlay");

    // Cards.
    let cards = document.querySelectorAll(".card");

    showRules.addEventListener("click", function() {
        rulesOverlay.style.display = "inline";
    });

    closeRules.addEventListener("click", function() {
        rulesOverlay.style.display = "none";
    });

    soundIcon.addEventListener("click", function() {
        soundIcon.src = soundIcon.src.endsWith("no-sound.png") ? "images/sound.png" : "images/no-sound.png";
    })

    cards.forEach(card => card.addEventListener("click", function() {
        // Remove 'selected' class from all cards.
        cards.forEach(card => card.classList.remove("selected"));

        // Add 'selected' class to card.
        card.classList.add("selected");
    }))
})();