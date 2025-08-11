document.addEventListener("DOMContentLoaded", function () {
    const results = JSON.parse(document.getElementById("results-data").textContent);
    const resultsPerPage = 10;
    let currentPage = 1;

    function renderResults() {
        const start = (currentPage - 1) * resultsPerPage;
        const end = start + resultsPerPage;
        const pageResults = results.slice(start, end);

        const resultsContainer = document.getElementById("results-container");
        resultsContainer.style.opacity = 0; // Fade out before updating

        setTimeout(() => {
            resultsContainer.innerHTML = ""; // Clear previous cards

            pageResults.forEach((book, index) => {
                const card = document.createElement("div");
                card.className = "card book-card text-center";
                card.innerHTML = `
                    <div class="book-cover-container">   
                        <div class="search-cover-inner">                            
                            <div class="book-cover-front">
                                <img src="${book.cover_url ? book.cover_url : '/assets/dummy-image-portrait.jpg'}" alt="Book Cover" class="book-cover img-fluid">
                            </div>                            
                        </div>
                    </div>

                    <!-- Book Info -->
                    <div class="card-body">
                        <h5 class="card-title title">
                            ${book.title} ${book.year ? "(" + book.year + ")" : ""}
                        </h5>
                        <p class="text-muted card-title text">By ${book.author}
                        </p>

                        <!-- More Info Button -->
                        <form action="/details/${book.olid}" method="POST"> <input type="hidden" name="bookData" value="${encodeURIComponent(JSON.stringify(book))}"> <button class="btn btn-primary mt-2 title title" type="submit">Read More</button></form>
                    </div>
                `;

                card.style.opacity = 0; // Start invisible
                card.style.transform = "translateY(10px)"; // Move slightly down

                resultsContainer.appendChild(card);

                // Staggered fade-in effect
                setTimeout(() => {
                    card.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
                    card.style.opacity = 1;
                    card.style.transform = "translateY(0)";
                }, index * 50);
            });

            resultsContainer.style.transition = "opacity 0.3s ease-in-out";
            resultsContainer.style.opacity = 1;
        }, 200);

        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(results.length / resultsPerPage);
        const paginationControls = document.getElementById("pagination-controls");
        paginationControls.innerHTML = "";

        if (currentPage > 1) {
            paginationControls.appendChild(createPageButton("« Prev", currentPage - 1));
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPageButton(i, i);
            if (i === currentPage) {
                pageButton.style.fontWeight = "bold";
                pageButton.style.transform = "scale(1.1)";
            }
            paginationControls.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            paginationControls.appendChild(createPageButton("Next »", currentPage + 1));
        }
    }

    function createPageButton(text, page) {
        const button = document.createElement("button");
        button.innerText = text;
        button.style.margin = "0 5px";
        button.style.padding = "5px 10px";
        button.style.border = "1px solid #ccc";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.transition = "background 0.2s, transform 0.2s";

        button.addEventListener("mouseover", () => {
            button.style.background = "#ddd";
            button.style.transform = "scale(1.1)";
        });

        button.addEventListener("mouseout", () => {
            button.style.background = "";
            button.style.transform = "scale(1)";
        });

        button.addEventListener("click", function () {
            currentPage = page;
            renderResults();
        });

        return button;
    }

    renderResults();
});
