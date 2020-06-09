// Global variables
let currentPage = 0; // Current page (replace with a call for most recent page?)
let maxPages; // How many pages are in this document (set in function below)
let pageChange = 0; // Used to know if we are changing pages, and determines which direction we are going

// Initial position of the first page (set in the "firstRun" function)
let leftPos;
let topPos;

function firstRun() {
    // How many pages?
    var pages = document.getElementsByClassName("Page");
    maxPages = pages.length - 1;

    // Display current page (default is 1)
    pages[currentPage].style.display = "block";

    // Event handler for when the "previous" button is pressed
    document.getElementById("previous").addEventListener("click", function () {
        // Make sure we are not on the first page or are in the middle of a page change
        if (currentPage > 0 && pageChange == 0) {
            
            // Scroll back to the top of the screen when the animation is over
            window.scrollTo(0, 0);

            // Set an ending animation for the old page
            pages[currentPage].style.WebkitAnimation = "oldPage 1s";
            pages[currentPage].style.animation = "oldPage 1s";
            pages[currentPage].setAttribute("data-change", "yes"); // Set that this will be the one to disappear

            // Change the page and set which direction our page went
            currentPage--;
            pageChange = 1;

            // Display our new page and set the position to be right on top of the old one
            pages[currentPage].style.display = "block";
            pages[currentPage].style.position = "relative";

            // Set the animation
            pages[currentPage].style.WebkitAnimation = "newPageLeft 1s";
            pages[currentPage].style.animation = "newPageLeft 1s";
        }
    });

    // Event handler for when the "next" button is pressed (nearly identical code to event handler above)
    document.getElementById("next").addEventListener("click", function () {
        // Make sure we are not on the last page or are in the middle of a page change
        if (currentPage < maxPages && pageChange == 0) {
            // Also make sure that if there is a concept checkpoint that they answer it first
            var conceptDone;
            var afterCheckpoint = pages[currentPage].querySelector("#AfterCheckpoint");
            if (afterCheckpoint != null && window.getComputedStyle(afterCheckpoint).getPropertyValue("display") == "none") {
                conceptDone = false;
            }
            else {
                conceptDone = true;
            }

            if (conceptDone) {
                // Scroll back to the top of the screen when the animation is over
                window.scrollTo(0, 0);

                // Get current position of this element
                var bodyXY = document.body.getBoundingClientRect();
                var pageXY = pages[currentPage].getBoundingClientRect();
                topOffset = bodyXY.top - pageXY.top;

                // Set an ending animation for the old page
                pages[currentPage].style.WebkitAnimation = "oldPage 1s";
                pages[currentPage].style.animation = "oldPage 1s";
                pages[currentPage].setAttribute("data-change", "yes"); // Set that this will be the one to disappear

                // Change the page and set which direction our page went
                currentPage++;
                pageChange = -1;

                // Display our new page and set the position to be right on top of the old one
                pages[currentPage].style.display = "block";
                pages[currentPage].style.position = "absolute";
                //pages[currentPage].offsetLeft = leftPos;
                pages[currentPage].style.bottom = 0 + topOffset;


                // Set the animation
                pages[currentPage].style.WebkitAnimation = "newPageRight 1s";
                pages[currentPage].style.animation = "newPageRight 1s";
            }
            else {
                alert("Please answer the concept checkpoint question first");
            }
        }
    });

    // Set listener for all pages to check when an animation ends, and then do something appropriately
    for (var i = 0; i < pages.length; i++) {
        pages[i].addEventListener("animationend", function () {
            // Add an event listener to the "answer" button (if exists)
            var answerButton = pages[currentPage].querySelector("#answer");
            if (answerButton != null) {
                answerButton.addEventListener("click", function() {
                    // Show the concept checkpoint
                    pages[currentPage].querySelector("#AfterCheckpoint").style.display = "block";
                });
            }

            // Make sure that it is the old page and not the new page
            //// (They both just went through an animation, we don't want both pages disappearing)
            if (pages[currentPage + pageChange].getAttribute("data-change") == "yes") {
                // Hide the old page (we use "pageChange" to go in the direction of the old page)
                pages[currentPage + pageChange].style.display = "none";
                pages[currentPage].style.position = "static"; // "Static" so that the page is where it's supposed to be in the page
                pages[currentPage].setAttribute("data-change", "no"); // Reset back to not changing
                pageChange = 0; // Reset so we can change the page again
            }
        });
    }
}