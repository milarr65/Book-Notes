import express from "express";
import { createBook, deleteBook, updateBook } from "../lib/queries.js";

const router = express.Router();

router.post("/db/add", async (req, res) => {
	try {
		await createBook(req.body);
		res.redirect("/");
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.render("error", { errorMessage: "Failed to log book", status: 500 });
	}
});

router.post("/db/:id/update", async (req, res) => {
	const data = req.body;
	const { id: bookId } = req.params;

	try {
		await updateBook(bookId, data);
		res.redirect(`/book/${bookId}`);
	} catch (error) {
		console.error(error);

		res
			.status(500)
			.render("error", { errorMessage: "Failed to update book", status: 500 });
	}
});

router.post("/db/:id/delete", async (req, res) => {
	try {
		await deleteBook(req.params.id);
    res.redirect("/");
	} catch (error) {
    console.error(error);

    res
			.status(500)
			.render("error", { errorMessage: "Failed to delete book", status: 500 });
	}    
  
});

export default router;
