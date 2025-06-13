import express from 'express';
import axios from 'axios';
import db from '../db/db.js';
import { marked } from "marked"; //converts markdown to html
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();
const base_url = 'https://openlibrary.org' /* add .json at the end */

// Get book from database and render details page 
router.get('/details/:book_id', async (req, res) => {
  const book_id = req.params.book_id;
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [book_id]);
    const book = result.rows[0];
    const date = new Date(book.created_at);  // Convert string to Date object

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    book.created_at = formattedDate;
    res.render('details', { book, isFromApi: false });

  } catch (error) {
    console.log(error);
    res.render('error', { errorMessage: "Failed to fetch book details.", status:500 });
  }


});


/* Recieves book object from search results and renders details page */
router.post('/details/:book_id', async (req, res) => {
  const book_id = req.params.book_id;
  try {

    const bookData = JSON.parse(decodeURIComponent(req.body.bookData)); // book object passed through a <form>
    const result = await axios.get(`${base_url}/works/${book_id}.json`); // get book info from api
    const ratingsQuery = await axios.get(`${base_url}/works/${book_id}/ratings.json`); // get book ratings from api

    // access info
    const ratingsData = ratingsQuery.data.summary;
    const data = result.data;

    //check if book has description
    if (data.description) {
      // Access book description depending on the format it comes as
      const description = typeof data.description === 'object'
        ? data.description.value
        : data.description;

      /*  add description to book's previous data. Make it html format in case it comes as markdown */
      bookData.description = marked(description);

    } else {
      console.log("No description available.");
    }

    // check that ratings are not null and are int before adding to book object
    if (ratingsData && ratingsData.average != null && !isNaN(ratingsData.average)) {
      ratingsData.average = parseFloat(ratingsData.average).toFixed(1); // round ratings to 1 decimal
      bookData.apiRatings = ratingsData;
    }

    // console.log(bookData);

    res.render('details', { book: bookData, isFromApi: true });

  } catch (error) {
    console.log(error);
    res.render('error', { errorMessage: "Failed to fetch book details.", status:500 });
  }
});

// Recieve book object passed through a form and uses it to pre-fill add form
router.post('/add-book', async (req, res) => {
  const book = JSON.parse(decodeURIComponent(req.body.bookData));
  res.render('add-book', { book });
});

/* saves user's book to postgres database.*/
router.post('/save-book', checkAuth, async (req, res) => {
  let { title, author, cover_id, user_rating, review, olid, cover_url, description, year } = req.body;

  try {

    const result = await db.query(
      'INSERT INTO books (title, author, cover_id, user_rating, review, olid, cover_url, description, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING title, user_rating', [
      title,
      author,
      cover_id,
      user_rating,
      review,
      olid,
      cover_url,
      description,
      year,
    ]);

    // console.log(result.rows);

    res.redirect("/");

  } catch (error) {
    console.log(error);
    res.render('error', { errorMessage: "Failed to log book.", status:500 });
  }

});

/* Render edit form pre-filled with existing data */
router.get('/edit-book/:id', async (req, res) => {
  const book_id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [book_id]);

    if (result.rows.length === 0) {
      return res.render('error', { errorMessage: "Book not found.", status:404 });
    }

    res.render('edit-book.ejs', { book: result.rows[0] })

  } catch (error) {
    console.log(error);
    res.render('error', { errorMessage: "Oops, something went wrong.", status:500 });
  }
});


/* Update book in database */
router.post('/update/:id', checkAuth, async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query('UPDATE books SET title = $1, author = $2, user_rating = $3, review = $4 WHERE id = $5 RETURNING id, title', [
      req.body.title,
      req.body.author,
      req.body.user_rating,
      req.body.review,
      bookId
    ]);
    // console.log(result.rows[0]);

    res.redirect(`/details/${bookId}`);
  
  } catch (error) {
    console.log(error);
    res.render('error', { errorMessage: "Failed to update book.", status:500 });
  }
});

/* Delete book from data base */
router.post('/delete/:id', checkAuth, async (req, res) => {
  const bookId = req.params.id;

  try {
    const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING id, title', [bookId]);
    // console.log(result.rows);
    res.redirect('/');

  } catch (error) {
    console.log(error);
    res.render('error', { errorMessage: "Unable to delete book.", status:500 });
  }
});

export default router;