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

    const nextCaseButton = document.querySelector("#next-case");

    // Sound.
    const soundIcon = document.querySelector("#sound-icon");
    const soundtrack = new Audio("sounds/dark-spy.mp3"); 
    const pageTurn1 = new Audio("sounds/page-turn-1.mp3"); 
    const pageTurn2 = new Audio("sounds/page-turn-2.mp3"); 
    const pageTurn3 = new Audio("sounds/page-turn-3.mp3"); 
    const pageTurn4 = new Audio("sounds/page-turn-4.mp3"); 
    let musicPlaying = false;

    // Submit answers (2/2 must be correct).
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

            // Play sound.
            // musicPlaying && pageTurn.play();
            if(musicPlaying) {
                let randomNum = Math.floor(4 * Math.random()) + 1;
                if(randomNum == 1) {
                    pageTurn1.play()
                } else if(randomNum == 2) {
                    pageTurn2.play()
                } else if(randomNum == 3) {
                    pageTurn3.play();
                } else if(randomNum == 4) {
                    pageTurn4.play();
                }
            }

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

    // Zoom and click into individual images.
    overlayImages.addEventListener("mouseover", function(e) {
        if(e.target.tagName === "IMG") {
            e.target.classList.add("hovered-img");
        }
    });

    overlayImages.addEventListener("mouseout", function(e) {
        if(e.target.tagName === "IMG") {
            e.target.classList.remove("hovered-img");
        }
    });

    const zoomedImage = document.querySelector("#zoomed-image");

    overlayImages.addEventListener("click", function(e) {
        if(e.target.tagName === "IMG") {
            // Clear element.
            zoomedImage.innerHTML = "";
            zoomedImage.style.display = "flex";

            // Apply image element.
            const imgElement = document.createElement("img");
            imgElement.src = e.target.src;
            imgElement.alt = e.target.alt;
      
            // Adjust dimensions of image.
            if(imgElement.naturalWidth > imgElement.naturalHeight) {
                imgElement.style.width = "540px";
                imgElement.style.height = e.target.naturalHeight * (540 / e.target.naturalWidth) + "px";
            } else {
                imgElement.style.height = "450px";
                imgElement.style.width = e.target.naturalWidth * (450 / e.target.naturalHeight) + "px";
            }

            zoomedImage.appendChild(imgElement);
            zoomedImage.style.width = imgElement.style.width;
            zoomedImage.style.height = imgElement.style.height;

            // Add an 'x' button.
            /*const iconElement = document.createElement("i");
            iconElement.classList.add("fa-solid", "fa-xmark");
            zoomedImage.appendChild(iconElement);*/
        }
    });

    // Click out of overlay.
    mainImg.addEventListener("click", function(){
        /*overlayElement.style.display = "none";
        zoomedImage.style.display = "none";*/
        escapeOverlays();
    });

    overlayElement.addEventListener("click", function(e){
        if(e.target.tagName !== "IMG") {
            zoomedImage.style.display = "none";
        }
    });

    // Click on darkened background to escape overlays.
    darkenBackground.addEventListener("click", escapeOverlays);

    document.addEventListener("keydown", function(e) {
        switch(e.key) {
            // 'Esc' key also escapes overlays.
            case "Escape": e.preventDefault(); escapeOverlays(); break;
            default: break;
        }
    });

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

    // Next case.
    nextCaseButton.addEventListener("click", function(event){
        event.preventDefault();
        alert("To be continued...");
    });

    // Initial sound settings.
    window.addEventListener("load", function(){
        musicPlaying = false;
        soundtrack.loop = true;
        soundtrack.volume = 0.7;
        pageTurn1.volume = 0.8;
        pageTurn2.volume = 0.8;
        pageTurn3.volume = 0.8;
        pageTurn4.volume = 0.8;
    });

    soundIcon.addEventListener("click", function() {
        // Change icon.
        soundIcon.src = soundIcon.src.endsWith("no-sound.png") ? "images/sound.png" : "images/no-sound.png";

        // Change state.
        musicPlaying = !musicPlaying;

        musicPlaying == true ? soundtrack.play() : soundtrack.pause();
    });

    function styleIcons() {
        feather.replace();
    }

    function escapeOverlays() {
        darkenBackground.style.display = "none";
        storyOverlay.style.display = "none";
        caseSolvedOverlay.style.display = "none";

        if(zoomedImage.style.display == "flex") {
            zoomedImage.style.display = "none";
        } else {
            overlayElement.style.display = "none";   
        }
    }
})();

// STRETCH GOAL: Add tutorial screen. 
// STRETCH GOAL: Add timer.
// STRETCH GOAL: Add 'X' to exit image.
// GOAL: Add link to sources.html.
