import express from 'express';
import db from '../db/db.js';

const router = express.Router();
let books = [];

router.get('/', async (req, res) => {
    //get sorting options from query. default to recently added
    const sortBy = req.query.sort || 'recent';
    let orderBy = 'created_at DESC';

    // console.log('sort by: ' + sortBy);


    if (sortBy === 'title') {
        orderBy = 'title ASC'
    } else if (sortBy === 'rating') {
        orderBy = 'user_rating DESC NULLS LAST'
    }

    try {
        const result = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);

        books = result.rows;

        res.render('index.ejs', { books, sortBy, activePage: "home" })

    } catch (error) {
        console.log('Error loading books: ', error);
        res.render('error', { errorMessage: "Failed to load books.", status:500 });
    }
});

export default router;