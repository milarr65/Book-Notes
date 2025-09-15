# Book Notes | Web-Dev Project

This is a web app where I can keep a record of all the books I've read. I can create and save new entries as well as update or delete previous ones. I've restricted this functions so only I can alter the database, but users can still look up books with the search bar. Book details and cover images are provided by [The Open Library API](https://openlibrary.org/developers/api)

I've also migrated my database to [Supabase.](https://supabase.com/)

_Built with NodeJS, Express, Bootstrap and PostgreSQL._

## Screenshots

![Homepage](<public/assets/Captura de pantalla 2025-03-20 192019.png>)
![book-details page](<public/assets/Captura de pantalla 2025-03-20 192048.png>)

## 💻 How to run this in your personal machine:

> [!Note]
> You will need to have [PostgreSQL](https://www.postgresql.org/download) installed along with pgAdmin 4

1. Git clone this repository

   ```bash
   git clone https://github.com/milarr65/Book-Notes.git
   cd book-notes
   ```

2. Run `npm i` in your terminal to install all the necessary node packages
3. Create a new database in pgadmin called **bookNotes**
4. Use the sql commands found in the [queries.sql](queries.sql) file to create the table 'books'.
5. To connect the server to your postgres database. You can either make a `.env` file to store your user, password, database name, host and port. Or simply write them inside the code
6. Now you can start the server by typing in your terminal `node index.js` or `nodemon index.js`
7. Next go to `http://localhost:3000` in your browser and that's it

### About

This project is part of the webcourse **_The Complete Full-Stack Web Development Bootcamp_**

The goal was for us to build a website that uses a Postgresql database to save data. We were given no starter code and full freedom to design and build the functionality and ui of the site.
