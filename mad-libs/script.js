import madLibStories from "./madLibStories.js";
console.log("check1");

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
            console.log(randomIndex);

            // Identify story prompts (stored as property-tuple).
            const promptParams = madLibStories[randomIndex].prompts;

            // Create label/input pairs.
            createLabelInput(randomIndex, promptParams, formContainer);

            // Add index to generatedStories list.
            generatedStories.push(randomIndex);
        }
    }

    // FUNCTION: Create label/input pairs.
    function createLabelInput(index, storyPrompts, form)
    {
        const label1 = document.createElement("label");
        label1.innerHTML = storyPrompts[0];
        const input1 = document.createElement("input");
        input1.type = "text";
        input1.name = `story${index}-prompt1`;
        input1.id = input1.name;
        input1.required = true;

        const label2 = document.createElement("label");
        label2.innerHTML = storyPrompts[1];
        const input2 = document.createElement("input");
        input2.type = "text";
        input2.name = `story${index}-prompt2`;
        input2.id = input2.name;
        input2.required = true;

        form.appendChild(label1);
        form.appendChild(input1);
        form.appendChild(document.createElement("br"));

        form.appendChild(label2);
        form.appendChild(input2);
        form.appendChild(document.createElement("br"));
    }

    // FUNCTION: Generate story.
    function generateStory(textBox)
    {
        preventDefault();
        // Submit form responses.
    }
})();