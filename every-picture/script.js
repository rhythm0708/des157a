(function(){
    "use strict";
    console.log("reading js");

    // Scene.
    const mainImg = document.querySelector("#main-scene");

    // Question form.
    const form = document.querySelector("#case-questions");

    // Story and solution overlays.
    const darkenBackground = document.querySelector("#darken");
    const storyLink = document.querySelector("#story-link");
    const storyOverlay = document.querySelector("#story-overlay");
    const caseSolvedLink = document.querySelector("#case-solved-link");
    const caseSolvedOverlay = document.querySelector("#case-solved-overlay");

    // Next case.
    const nextCaseButton = document.querySelector("#next-case");

    form.addEventListener("submit", function(event){
        event.preventDefault();
        const answer1 = document.querySelector("#question1").value;
        const answer2 = document.querySelector("#question2").value;

        if (answer1 === "" || answer2 === "") {
            alert("You must answer both questions.");
        } else if (answer1 === "jorge" && answer2 === "hannah") {
            darkenBackground.style.display = "inline";
            caseSolvedOverlay.style.display = "inline";
            caseSolvedLink.style.display = "inline";
            nextCaseButton.style.display = "inline";
        } else {
            alert("At least one of the two answers is wrong.");

        }
    });

    // Manipulate icons.
    styleIcons();

    // Hover effects.
    const imageMapAreas = document.querySelectorAll('map[name="image-map"] area');
    const tooltip = document.querySelector("#tooltip");
    const tipOffsetX = -50;
    const tipOffsetY = -50;

    // Click effects.
    const overlayElement = document.querySelector("#overlay");
    const overlayImages = document.querySelector("#overlay-images");
    const overlayText = document.querySelector("#overlay-text");

    let objectOverlaysMap = new Map();  

    fetch('overlay.json')
        .then(response => response.json()) 
        .then(data => {
            objectOverlaysMap = new Map(data.map(item => [item.object, item]));
        })
        .catch(error => console.error('Error loading overlay.json: ', error));

    imageMapAreas.forEach(area => {
        area.addEventListener('click', function(event) {
            event.preventDefault();

            // Clear overlay.
            overlayImages.innerHTML = "";
            overlayText.innerHTML = "";

            // Collect information on the matching object.
            let objectName = area.id.slice(0,-4);
            let objectOverlay = objectOverlaysMap.get(objectName);

            if(objectOverlay) {
                // Place appropriate images.
                for (const imagePath of objectOverlay.images) {
                    const imgElement = document.createElement("img");
                    imgElement.src = "./images/zooms/" + imagePath;
                    console.log(imgElement.src);
                    imgElement.alt = imagePath;
                    overlayImages.appendChild(imgElement);
                }

                // Place appropriate text.
                let text = objectOverlay.text;
                let textElement = document.createElement("p");
                textElement.textContent = text;
                overlayText.appendChild(textElement);

                // Display.
                overlayElement.style.display = "flex";
            } else {
                alert("Functionality has not been made yet.");
            }
        });

        area.addEventListener('mouseover', function(event){
            // Add shadow effect.
            let silID = "#" + area.id.slice(0,-4) + "-shadow";
            let targetedSil = document.querySelector(silID);
            targetedSil.classList.add("hovered");

            // Move, edit tooltip.
            tooltip.style.display = "inline";
            tooltip.style.left = `${event.pageX + tipOffsetX}px`;
            tooltip.style.top = `${event.pageY + tipOffsetY}px`;
            tooltip.textContent = area.getAttribute("alt");
        });

        area.addEventListener('mouseout', function(){
            // Remove shadow effect.
            let silID = "#" + area.id.slice(0,-4) + "-shadow";
            let targetedSil = document.querySelector(silID);
            targetedSil.classList.remove("hovered");

            // Move tooltip.
            tooltip.style.display = "none";
        });
    })

    // Review the story.
    storyLink.addEventListener("click", function(event){
        event.preventDefault();
        darkenBackground.style.display = "inline";
        storyOverlay.style.display = "inline";
    });

    // Review the solution.
    caseSolvedLink.addEventListener("click", function(event){
        event.preventDefault();
        darkenBackground.style.display = "inline";
        caseSolvedOverlay.style.display = "inline";
    });

    // Next case?
    nextCaseButton.addEventListener("click", function(event){
        event.preventDefault();
        alert("To be continued...");
    });

    // Click out of overlay.
    mainImg.addEventListener("click", function(){
        overlayElement.style.display = "none";
    });

    // Click on darkened background to escape overlays.
    darkenBackground.addEventListener("click", function(){
        darkenBackground.style.display = "none";
        storyOverlay.style.display = "none";
        caseSolvedOverlay.style.display = "none";
    });

    function styleIcons() {
        feather.replace();
    }
})();

// STRETCH GOAL: Add "story" overlay and tutorial screen.