import madLibStories from "./madLibStories.js";

(function(){
    "use strict";
    console.log("reading js");

    // Form container.
    const formContainer = document.querySelector("#mad-libs-form");
    const noOfStories = 5;

    // Results screen.
    const darkBackground = document.querySelector("#darken-background");
    const resultsContainer = document.querySelector("#results-screen");

    // Generate prompts on load.
    let storyTemplates = [];
    try { 
        storyTemplates = generatePrompts(formContainer, noOfStories); 
    } catch(error) { 
        console.error(`The prompts could not be generated: ${error}`); 
    }

    // Submit button.
    const formSubmit = document.querySelector("form button");
    formSubmit.addEventListener("click", function(event)
    {
        event.preventDefault();

        // Collect form responses.
        const userInputs = formContainer.querySelectorAll("input");

        // Validate input.
        if(!validateForm(userInputs))
        {
            return;
        }

        // Darken backgrounds.
        darkBackground.className = "showing";
        resultsContainer.className = "showing";

        // Count number of prompts.
        const noOfPrompts = countPrompts(storyTemplates);

        // Collect form data in object.
        const formData = {};
        userInputs.forEach(input => {
            formData[input.id] = input.value.trim();
        })

        // Generate story.
        generateStory(storyTemplates, formData, resultsContainer);

        // Clear form.
        clearForm(formContainer);

        // Add return button.
        const returnButton = document.createElement("button");
        returnButton.type = "reset";
        returnButton.textContent = "Try It Again!";
        resultsContainer.appendChild(returnButton);

        // Return button functionality.
        returnButton?.addEventListener("click", function(event)
        {
            event.preventDefault();
            closeOverlays();
        });
    });

    // FUNCTION: Validate input.
    function validateForm(inputs)
    {
        let valid = true;

        // Check that inputs are not blank
        for(let input of inputs) 
        {
            if (input.value.trim() === "")
            {
                alert("Fill in all the blanks.");
                valid = false;
                break;
            }
        }
        return valid;
    }

    // FUNCTION: Generate prompts to populate form.
    function generatePrompts(form, noOfStories)
    {
        // Ensure no repeats.
        let generatedStories = [];

        // Remove any standing prompts.
        const formLabels = form.querySelectorAll("label");
        const formInputs = form.querySelectorAll("input");
        const btn = form.querySelector("button");
        formLabels?.forEach(label => label.remove());
        formInputs?.forEach(input => input.remove());
        btn?.remove();
        
        // Generate the appropriate prompts.
        for(let i=0; i<noOfStories; i++)
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

        return generatedStories;
    }

    // FUNCTION: Clear form
    function clearForm(form)
    {
        const inputs = form.querySelectorAll("input[type=text]");

        inputs.forEach(input => input.value = "");
    }
    // FUNCTION: Counts total number of prompts involved.
    function countPrompts(stories)
    {
        let noOfPrompts = 0;
        stories.forEach(story => 
        {
            noOfPrompts += madLibStories[story].prompts.length;
        });
        return noOfPrompts;
    }

    // FUNCTION: Create label/input pairs.
    function createLabelInput(storyIndex, storyPrompts, form)
    {
        for(const [index, prompt] of storyPrompts.entries())
        {
            // Store in "form-group" class div.
            const formGroup = document.createElement("div");
            formGroup.classList.add("form-group");

            const label = document.createElement("label");
            label.innerHTML = storyPrompts[index];
            const input = document.createElement("input");
            input.type = "text";
            input.name = `story${storyIndex}-prompt${index}`;
            input.id = input.name;
            input.required = true;

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            form.appendChild(formGroup);
        }
    }

    // FUNCTION: Generate story.
    function generateStory(stories, inputs, textBox)
    {
        // Submit form responses.
        resultsContainer.innerHTML = "";

        // Create introductory text.
        const resultsText = document.createElement("h2");
        resultsText.textContent = "Here are your ideas:"
        resultsText.className = "bold";
        textBox.appendChild(resultsText);

        // Print each story.
        for(let [index, story] of stories.entries())
        {
            // Store in "story-block" div.
            const storyBlock = document.createElement("div");
            storyBlock.classList.add("story-block");

            // Create headings and idea text.
            const storyHeading = document.createElement("h3");
            let headingText = `${index+1}. ` + madLibStories[story].heading;
            const storyIdea = document.createElement("p");
            let ideaText = madLibStories[story].story;

            // Use RegEx to replace all instances of words.
            for(let [index, prompt] of madLibStories[story].prompts.entries())
            {
                const placeholder = `[${prompt.toLowerCase()}]`
                const userWord = inputs[`story${story}-prompt${index}`];
                const replacement = `<span class="underline">${userWord}</span>`;

                headingText = headingText.replace(placeholder, replacement);
                ideaText = ideaText.replace(placeholder, replacement);
            }

            storyHeading.innerHTML = headingText;
            storyIdea.innerHTML = ideaText;

            // Append to text box.
            // STRETCH: Typing effect for text
            storyBlock.appendChild(storyHeading);
            storyBlock.appendChild(storyIdea);
            textBox.append(storyBlock);
        }
    }

    // FUNCTION: Hides overlays.
    function closeOverlays()
    {
        // Return to prompt screen (hide overlays).
        darkBackground.className = "hidden";
        resultsContainer.className = "hidden";
    }

    // TODO: Button to automatically fill in random text
    // On the word "Idea" ?
})();