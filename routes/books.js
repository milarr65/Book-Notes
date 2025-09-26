import express from "express";
import axios from "axios";
import db from "../db/db.js";
import { marked } from "marked"; //converts markdown to html
import { getBook } from "../lib/api.js";
import { getBookById } from "../lib/queries.js";

const router = express.Router();
const base_url = "https://openlibrary.org"; /* add .json at the end */

// ---- TEST ----
router.get("/book/:id", async (req, res) => {
	const bookId = req.params.id;
	// console.log("Book ID: ", bookId);

	try {
		if (bookId.includes("OL")) {
			const book = await getBook("/works/" + bookId);
			res.render("details", { book, isFromApi: true });
		} else {
			const book = await getBookById(bookId);
			book.created_at = new Date(book.created_at).toLocaleDateString("en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
			// console.log(book.created_at);
			res.render("details", { book, isFromApi: false });
		}
	} catch (error) {
		console.error(error);

		res.status(500).render("error", {
			errorMessage: "Something went wrong, failed to display book details.",
			status: 500,
		});
	}
});

router.get("/book/:id/add", async (req, res) => {
	const bookId = req.params.id;

	try {
		const book = await getBook("/work/" + bookId);
		// console.log(book);
		res.render("add-book", { book });
	} catch (error) {
		console.error(error);

		res.status(500).render("error", {
			errorMessage: "Something went wrong when trying to load add form",
			status: 500,
		});
	}
});

router.get("/book/:id/edit", async (req, res) => {
	try {
		const book = await getBookById(req.params.id);
		// console.log(book);

		res.render("edit-book", { book });
	} catch (error) {
		console.error(error);

		res.status(500).render("error", {
			errorMessage: "Something went wrong when trying to load edit form",
			status: 500,
		});
	}
});


export default router;
