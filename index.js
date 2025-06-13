import express from "express";
import bodyParser from "body-parser";
import supabase from "./supabase/supabaseClient.js";

import homeRoutes from './routes/home.js';
import pageRoutes from './routes/pages.js';
import bookRoutes from './routes/books.js';

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', homeRoutes);
app.use('/', pageRoutes);
app.use('/', bookRoutes);

const search_url = 'https://openlibrary.org/search.json';
const covers_url = 'https://covers.openlibrary.org/b' /* add <key>-L.jpg */
const base_url = 'https://openlibrary.org' /* add .json at the end */

let books = [];

//Home route. Displays all logged books and handles sorting options
// app.get('/', async (req, res) => {
//     //get sorting options from query. default to recently added
//     const sortBy = req.query.sort || 'recent';
//     let orderBy = 'created_at DESC';

//     console.log('sort by: ' + sortBy);


//     if (sortBy === 'title') {
//         orderBy = 'title ASC'
//     } else if (sortBy === 'rating') {
//         orderBy = 'user_rating DESC NULLS LAST'
//     }

//     try {
//         const result = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);

//         books = result.rows;

//         res.render('index.ejs', { books, sortBy, activePage: "home" })

//     } catch (error) {
//         console.log('Error loading books: ', error);
//         res.render("index.ejs", { books: [], sortBy, activePage: "home", error: true });
//     }
// });

// app.get('/about', (req, res) => {
//     res.render('about', { activePage: "about" });
// });

// // Get book from database and render details page 
// app.get('/details/:book_id', async (req, res) => {
//     const book_id = req.params.book_id;
//     try {
//         const result = await db.query('SELECT * FROM books WHERE id = $1', [book_id]);
//         const book = result.rows[0];
//         const date = new Date(book.created_at);  // Convert string to Date object

//         const formattedDate = date.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });

//         book.created_at = formattedDate;
//         res.render('details', { book, isFromApi: false });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }


// });


// /* Recieves book object from search results and renders details page */
// app.post('/details/:book_id', async (req, res) => {
//     const book_id = req.params.book_id;
//     try {

//         const bookData = JSON.parse(decodeURIComponent(req.body.bookData)); // book object passed through a <form>
//         const result = await axios.get(`${base_url}/works/${book_id}.json`); // get book info from api
//         const ratingsQuery = await axios.get(`${base_url}/works/${book_id}/ratings.json`); // get book ratings from api

//         // access info
//         const ratingsData = ratingsQuery.data.summary;
//         const data = result.data;

//         //check if book has description
//         if (data.description) {
//             // Access book description depending on the format it comes as
//             const description = typeof data.description === 'object'
//                 ? data.description.value
//                 : data.description;

//             /*  add description to book's previous data. Make it html format in case it comes as markdown */
//             bookData.description = marked(description);

//         } else {
//             console.log("No description available.");
//         }

//         // check that ratings are not null and are int before adding to book object
//         if (ratingsData && ratingsData.average != null && !isNaN(ratingsData.average)) {
//             ratingsData.average = parseFloat(ratingsData.average).toFixed(1); // round ratings to 1 decimal
//             bookData.apiRatings = ratingsData;
//         }

//         console.log(bookData);

//         res.render('details', { book: bookData, isFromApi: true });

//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// // Render search results for user
// app.get('/search', async (req, res) => {

//     try {
//         const query = req.query.q; // user's input

//         const results = await searchAPI(query); // Search results using my function

//         if (results.length === 0) {
//             res.send("Error fetching search results.")
//         } else {
//             res.render('search', { results })

//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching search results');
//     }


// });

// //Use axios to send search query to Open Library API and return search results
// async function searchAPI(query) {

//     try {
//         const result = await axios.get(search_url, {
//             params: {
//                 q: query,
//                 fields: 'author_name,cover_i,title,subtitle,first_sentence,key,first_publish_year,ratings_count,edition_count,language',
//                 language: 'eng',
//                 mode: 'everything',
//                 page: 1,
//             }
//         });

//         // access data from result
//         const found_books = result.data.docs;

//         console.log('total results: ', found_books.length);

//         // Map obtained info into the desired format
//         const data = found_books.map(book => ({
//             title: book.title,
//             year: book.first_publish_year,
//             author: book.author_name ? book.author_name.join(', ') : 'Unknown',
//             cover_id: book.cover_i || null,
//             cover_url: book.cover_i ? `${covers_url}/id/${book.cover_i}-L.jpg` : null,
//             key: book.key, // Unique Open Library book key
//             olid: book.key.substring(7),
//         }));

//         return data

//     } catch (error) {
//         console.log(error);
//         return [];

//     }
// }

// // Recieve book object passed through a form and uses it to pre-fill add form
// app.post('/add-book', async (req, res) => {
//     const book = JSON.parse(decodeURIComponent(req.body.bookData));
//     res.render('add-book', { book });
// });

// /* saves user's book to postgres database.*/
// app.post('/save-book', async (req, res) => {
//     let { title, author, cover_id, user_rating, review, olid, cover_url, description, year } = req.body;

//     try {
//         const result = await db.query(
//             'INSERT INTO books (title, author, cover_id, user_rating, review, olid, cover_url, description, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING title, user_rating', [
//             title,
//             author,
//             cover_id,
//             user_rating,
//             review,
//             olid,
//             cover_url,
//             description,
//             year
//         ]);

//         console.log(result.rows);

//         res.redirect("/");

//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }

// });

// /* Render edit form pre-filled with existing data */
// app.get('/edit-book/:id', async (req, res) => {
//     const book_id = req.params.id;
//     try {
//         const result = await db.query('SELECT * FROM books WHERE id = $1', [book_id]);

//         if (result.rows.length === 0) {
//             return res.status(404).send("Book not found");
//         }

//         res.render('edit-book.ejs', { book: result.rows[0] })

//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// });


// /* Update book in database */
// app.post('/update/:id', async (req, res) => {
//     const bookId = req.params.id;
//     try {
//         const result = await db.query('UPDATE books SET title = $1, author = $2, user_rating = $3, review = $4 WHERE id = $5 RETURNING id, title', [
//             req.body.title,
//             req.body.author,
//             req.body.user_rating,
//             req.body.review,
//             bookId
//         ]);
//         console.log(result.rows[0]);

//         res.redirect(`/details/${bookId}`);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

// /* Delete book from data base */
// app.post('/delete/:id', async (req, res) => {
//     const bookId = req.params.id;

//     try {
//         const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING id, title', [bookId]);
//         console.log(result.rows);
//         res.redirect('/');

//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});