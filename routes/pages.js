import express from "express";
import { searchBooks } from "../lib/api.js";
import { getAllBooks } from "../lib/queries.js";

const router = express.Router();

router.get("/", async (req, res) => {
	//get sorting options from query. default to recently added
	const sortBy = req.query.sort || "recent";
	let orderBy = ["created_at", { ascending: false }];

	if (sortBy === "title") {
		orderBy = ["title", { ascending: true }];
	} else if (sortBy === "rating") {
		orderBy = ["user_rating", { ascending: false, nullsFirst: false }];
	}

	try {
		const result = await getAllBooks(orderBy);

		const books = result;
		if (books.length <= 0) {
			res.render("error", {
				errorMessage: "Opps seems we couldn't find any books",
				status: 500,
			});
		}

		res.render("index.ejs", { books, sortBy, activePage: "home" });
	} catch (error) {
		console.error(error);
		res.render("error", { errorMessage: "Failed to load books.", status: 500 });
	}
});

router.get("/about", (req, res) => {
	res.render("about", { activePage: "about" });
});

router.get("/search", async (req, res) => {
	try {
		const results = await searchBooks(req.query.q);
		res.render("search", { results });
	} catch (error) {
		console.error(error);
		res.render("error", {
			errorMessage: "Failed to fetch search results.",
			status: 500,
		});
	}
});

export default router;
