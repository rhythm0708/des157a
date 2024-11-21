(function(){
    "use strict";
    console.log("reading js");

    // Buttons.
    const showRules = document.querySelector("#rules-button");
    const closeRules = document.querySelector("#close-rules");

    // Overlays.
    const rulesOverlay = document.querySelector("#rules-overlay");

    showRules.addEventListener("click", function(){
        rulesOverlay.style.display = "inline";
    });

    closeRules.addEventListener("click", function(){
        rulesOverlay.style.display = "none";
    });
})();