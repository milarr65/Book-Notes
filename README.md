# Book Notes | Web-Dev Project

This is a simple website where I can keep a record of all the books I've read. I can create and save new entries as well as update or delete previous ones. It also features a search functionality that will give me relevant information about books like description, reviews, and cover images. It is dynamyc and works on mobile.

Built with NodeJS, Bootstrap and PostgreSQL.

Book details and cover images are provided by [The Open Library API](https://openlibrary.org/developers/api)

## Screenshots

![Homepage](<public/assets/Captura de pantalla 2025-03-20 192019.png>)
![book-details page](<public/assets/Captura de pantalla 2025-03-20 192048.png>)

## To run this in your personal machine:

- Git clone this repository
- Run `npm i` in your terminal to install all the necessary node packages
- You will need to have [postgresql installed along with pgAdmin 4](https://www.postgresql.org/download)
  - Create a new database in pgadmin called **bookNotes**
  - Use the sql commands found in the [queries file](queries.sql) to create the table 'books', along with the necessary columns.
  - To connect the server to your postgres database you can either make a `.env` file to store your user, password, database name, host and port. Or simply write them inside the code
- Now you can start the server by typing in your terminal `node index.js` or `nodemon index.js`
- Next go to `http://localhost:3000` in your browser and that's it

### About

This project is part of the webcourse **_The Complete Full-Stack Web Development Bootcamp_**

The goal was for us to build a website that uses a Postgresql database to save data. We were given full freedom to design and build the functionality and ui of the site.

**All code in this repository was written by me, no tutorial was used for the development of this project**
