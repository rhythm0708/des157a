(function(){
    // Get relevant objects.
    const folderBtns = document.querySelectorAll(".folder");
    const articles = document.querySelectorAll("article");

    for(const [index, folder] of folderBtns.entries())
    {
        folder.addEventListener("click", function(event)
        {
            // Remove "visible" / "invisible" classes.
            articles.forEach(article => 
            {
                article.classList.remove("visible", "invisible");
            });

            // Show all classes if "All Entries" (index 0) is selected.
            if(index === 0)
            {
                articles.forEach(article => 
                {
                    article.classList.add("visible");
                });
            }
            // Otherwise only show the relevant entry.
            else
            {
                articles.forEach(article => 
                {
                    if(article.id === "article-" + (folderBtns.length-index))
                    {
                        article.classList.add("visible");
                    }
                    else
                    {
                        article.classList.add("invisible");
                    }
                });
            }
        });
    }
})();