CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author VARCHAR(100),
  cover_id INT,
  user_rating INT CHECK (user_rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  olid VARCHAR(20),
  cover_url VARCHAR(100),
  description TEXT,
  year INT
);

SELECT * FROM books;