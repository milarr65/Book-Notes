import express from 'express';
import axios from 'axios';

const router = express.Router();
const search_url = 'https://openlibrary.org/search.json';
const covers_url = 'https://covers.openlibrary.org/b' /* add <key>-L.jpg */

router.get('/about', (req, res) => {
  res.render('about', { activePage: "about" });
});

// Render search results for user
router.get('/search', async (req, res) => {

  try {
    const query = req.query.q; // user's input

    const results = await searchBooks(query); // Search results using my function

    if (results.length === 0) {
      res.render('error', { errorMessage: "Failed to fetch search results.", status: 500 });
    } else {
      res.render('search', { results })

    }

  } catch (error) {
    console.error(error.status, error.data);
    res.render('error', { errorMessage: "Failed to fetch search results.", status: 500 });
  }


});

//Use axios to send search query to Open Library API and return search results
async function searchBooks(query) {

  try {
    const result = await axios.get(search_url, {
      params: {
        q: query,
        fields: 'author_name,cover_i,title,subtitle,first_sentence,key,first_publish_year,ratings_count,edition_count,language',
        language: 'eng',
        mode: 'everything',
        page: 1,
      }
    });

    // access data from result
    const found_books = result.data.docs;

    console.log('total results for: ' + query + " " + found_books.length);

    // Map obtained info into the desired format
    const data = found_books.map(book => ({
      title: book.title,
      year: book.first_publish_year,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      cover_id: book.cover_i || null,
      cover_url: book.cover_i ? `${covers_url}/id/${book.cover_i}-L.jpg` : null,
      key: book.key, // Unique Open Library book key eg: works/OL12345
      olid: book.key.substring(7),
    }));

    return data

  } catch (error) {
    console.log("SearchApi error: ", error.data);
    return [];

  }
}

export default router;
