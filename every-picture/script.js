(function(){
    "use strict";
    console.log("reading js");

    const form = document.querySelector("#case-questions");

    form.addEventListener("submit", function(event){
        event.preventDefault();
        alert("i haven't made this part yet :)");
        // Add functionality here.
    });

    // Manipulate icons.
    styleIcons();

    function styleIcons()
    {
        feather.replace();
    }
})();

// STRETCH GOAL: Add "story" overlay and tutorial screen.