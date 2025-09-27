# Book Notes

This app is a web library where you can add and store ratings and reviews of books you've read.

## 🚀 Features

- Search functionality powered by [The Open Library API](https://openlibrary.org/developers/api)
- Add, edit, and delete books with ratings and reviews
- User-friendly book details page with star rating display
- CRUD route endpoints to interact with the database

## 🛠️ Tech Stack

- Backend: Node.js + Express
- Frontend: JavaScript + EJS templating
- Database: PostgreSQL / Supabase
- Styling: Bootsrap
- Deployment: Render

## 📸 Screenshots

![Homepage](public/assets/project-screenshot-1.png)
![book-details-page](public/assets/project-screenshot-2.png)

## ⚙️ Installation

> [!Note]
> You will need to have [PostgreSQL](https://www.postgresql.org/download) installed along with pgAdmin 4

1. Clone this repo and install dependencies

   ```bash
   git clone https://github.com/milarr65/Book-Notes.git

   cd book-notes

   npm install
   ```

2. Create a new database in pgadmin called **bookNotes**
3. Use the the [schema.sql](schema.sql) file to create a new table called **_books_**
4. Connect the server to your postgresql database.

   You can format a connection string like this:

   ```text
   postgres://username:password@hostname:port/database_name
   ```

   After that store your connection string in a .env file

   ```text
   DATABASE_URL=your_connection_string_here
   ```

5. Run the developer server using `npm run dev` and go to [http://localhost:3000/](http://localhost:3000/) on your browser to see the app
