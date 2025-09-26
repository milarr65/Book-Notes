import express from "express";
import { searchBooks } from "../lib/api.js";
import { getAllBooks } from "../lib/queries.js";

const router = express.Router();

router.get("/", async (req, res) => {
	//get sorting options from query. default to recently added
	const sortBy = req.query.sort || "recent";
	let orderBy = /* 'created_at DESC'; */ ["created_at", { ascending: false }];

	// console.log('sort by: ' + sortBy);

	if (sortBy === "title") {
		orderBy = /* 'title ASC' */ ["title", { ascending: true }];
	} else if (sortBy === "rating") {
		orderBy = /* 'user_rating DESC NULLS LAST' */ [
			"user_rating",
			{ ascending: false, nullsFirst: false },
		];
	}
	// console.log("Order By: ", orderBy);

	try {
		const result =
			/* await db.query(`SELECT * FROM books ORDER BY ${orderBy}`); */ await getAllBooks(
				orderBy
			);
		// console.log(result);

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
