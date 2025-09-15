import express from "express";

import homeRoutes from './routes/home.js';
import pageRoutes from './routes/pages.js';
import bookRoutes from './routes/books.js';

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', homeRoutes);
app.use('/', pageRoutes);
app.use('/', bookRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
