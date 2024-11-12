(function(){
    "use strict";
    console.log("reading js");

    const mainImg = document.querySelector("#main-scene");
    const form = document.querySelector("#case-questions");

    form.addEventListener("submit", function(event){
        event.preventDefault();
        const answer1 = document.querySelector("#question1").value;
        const answer2 = document.querySelector("#question2").value;

        if (answer1 === "none" || answer2 === "none") {
            alert("Fill in both blanks!");
        } else if (answer1 === "jorge" && answer2 === "hannah") {
            alert("Correct! You win.");
        } else {
            alert("Try again.");

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
                    imgElement.src = "images/zooms/" + imagePath;
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
            tooltip.textContent = area.getAttribute("title");
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

    mainImg.addEventListener("click", function(){
        overlayElement.style.display = "none";
    });

    function styleIcons()
    {
        feather.replace();
    }
})();

// STRETCH GOAL: Add "story" overlay and tutorial screen.