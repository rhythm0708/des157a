import madLibStories from "./madLibStories.js";

(function(){
    "use strict";
    console.log("reading js");

    // Form container.
    const formContainer = document.querySelector("#mad-libs-form");
    const noOfStories = 5;

    // Generate prompts on load.
    try { 
        generatePrompts(formContainer, noOfStories); 
    } catch(error) { 
        console.error(`The prompts could not be generated: ${error}`); 
    }
    
    // FUNCTION: Generate prompts to populate form.
    function generatePrompts(form, stories)
    {
        // Ensure no repeats.
        let generatedStories = [];

        // Remove any standing prompts.
        const formLabels = form.querySelectorAll("label");
        const formInputs = form.querySelectorAll("input");
        formLabels.forEach(label => label.remove());
        formInputs.forEach(input => input.remove());
        
        // Generate number of prompts equal to 2x stories.
        for(let i=0; i<stories; i++)
        {
            // Select a random story (index).
            let randomIndex = Math.floor(Math.random() * madLibStories.length);
            while (generatedStories.includes(randomIndex))
            {
                randomIndex = Math.floor(Math.random() * madLibStories.length);
            }
            console.log(`Idea #${randomIndex}.`);

            // Identify story prompts (stored as property-tuple).
            const promptParams = madLibStories[randomIndex].prompts;

            // Create label/input pairs.
            createLabelInput(randomIndex, promptParams, formContainer);

            // Add index to generatedStories list.
            generatedStories.push(randomIndex);
        }

        // Add submit button at the end.
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Start It Up!";
        formContainer.appendChild(submitButton);
    }

    // FUNCTION: Create label/input pairs.
    function createLabelInput(storyIndex, storyPrompts, form)
    {
        for(const [index, prompt] of storyPrompts.entries())
        {
            const label = document.createElement("label");
            label.innerHTML = storyPrompts[index];
            const input = document.createElement("input");
            input.type = "text";
            input.name = `story${storyIndex}-prompt${index}`;
            input.id = input.name;
            input.required = true;

            form.appendChild(label);
            form.appendChild(input);
            form.appendChild(document.createElement("br"));
        }
    }

    // FUNCTION: Generate story.
    function generateStory(textBox)
    {
        preventDefault();
        // Submit form responses.
    }
})();