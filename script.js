(function(){
    "use strict";
    console.log("reading js");

    const torches = document.querySelectorAll(".torch-container");

    // Recursive: torches flip at random intervals.
    setTimeout(flipTorches, 1000);

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function flipTorches() {
        // Wait 1–2 second interval.
        let randomInterval = 1000 * Math.random() + 1000;
        
        // Flip.
        torches.forEach(torch => {
            torch.style.transform = "rotateY(180deg)";
        });

        // Wait.
        randomInterval = 1000 * Math.random() + 1000;
        await wait(randomInterval);

        // Flip back.
        torches.forEach(torch => {
            torch.style.transform = "rotateY(0deg)";
        });

        // Repeat.
        setTimeout(flipTorches, randomInterval);
    }
})();