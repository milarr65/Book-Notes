import express from "express";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import session from "express-session";

import homeRoutes from './routes/home.js';
import pageRoutes from './routes/pages.js';
import bookRoutes from './routes/books.js';
import authRoutes from './routes/auth.js';

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // only send cookies over HTTPS in production
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use('/', homeRoutes);
app.use('/', pageRoutes);
app.use('/', bookRoutes);
app.use('/', authRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
