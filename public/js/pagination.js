document.addEventListener("DOMContentLoaded", function () {
	const results = JSON.parse(
		document.getElementById("results-data").textContent
	);
	const resultsPerPage = 10;
	let currentPage = 1;

	function renderResults() {
		const start = (currentPage - 1) * resultsPerPage;
		const end = start + resultsPerPage;
		const pageResults = results.slice(start, end);

		const resultsContainer = document.getElementById("results-container");
		resultsContainer.style.opacity = 0; // Fade out before updating

		if (results.length < 1) {
			resultsContainer.innerHTML = `<h1 class="title">No books found for your search</h1>`;
			resultsContainer.style.opacity = 1;
			resultsContainer.style.textAlign = "center";
			return;
		}

		setTimeout(() => {
			resultsContainer.innerHTML = ""; // Clear previous cards

			pageResults.forEach((book, index) => {
				const card = document.createElement("div");
				card.className = "book-card text-center";
				card.innerHTML = `
				<div class="card-img-wrapper">   
					<img src="${
						book.cover_url ? book.cover_url : "/assets/dummy-image-portrait.jpg"
					}" alt="Book Cover" class="book-cover img-fluid">
				</div>

				<!-- Book Info -->
				<div class="card-body">
					<h5 class="card-title title">
						${book.title} ${book.year ? "(" + book.year + ")" : ""}
					</h5>
					<p class="text-muted card-title text">By ${book.author}</p>
					<!-- More Info Button -->
					<a href="/book/${book.olid}" class="btn-soft mt-2 title title">Read More</a>
				</div>
				`;

				resultsContainer.appendChild(card);

				// Staggered fade-in effect
				setTimeout(() => {
					card.classList.add("visible");
				}, index * 50);
			});

			resultsContainer.style.opacity = 1;
		}, 200);

		renderPagination();
	}

	function renderPagination() {
		const totalPages = Math.ceil(results.length / resultsPerPage);
		const paginationControls = document.getElementById("pagination-controls");
		paginationControls.innerHTML = "";

		if (currentPage > 1) {
			paginationControls.appendChild(
				createPageButton("« Prev", currentPage - 1)
			);
		}

		for (let i = 1; i <= totalPages; i++) {
			const pageButton = createPageButton(i, i);
			if (i === currentPage) {
				pageButton.classList.add("active");
			}
			paginationControls.appendChild(pageButton);
		}

		if (currentPage < totalPages) {
			paginationControls.appendChild(
				createPageButton("Next »", currentPage + 1)
			);
		}
	}

	function createPageButton(text, page) {
		const button = document.createElement("button");
		button.innerText = text;
		button.className = "pagination-btn";

		if (page === currentPage) {
			button.classList.add("active");
		}

		button.addEventListener("click", function () {
			currentPage = page;
			renderResults();
		});

		return button;
	}
	
	renderResults();
});
