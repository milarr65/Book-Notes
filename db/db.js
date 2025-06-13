import pg from "pg";
import env from "dotenv";

env.config()

const { Pool } = pg;

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

db.connect()
    .then(() => console.log('Connected to the database!'))
    .catch(err => console.error('Connection error', err.stack));

export default db;
