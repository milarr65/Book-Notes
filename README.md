# Book Notes | Web-Dev Project

This project is part of the webcourse **_The Complete Full-Stack Web Development Bootcamp_**

Built with NodeJS, Bootstrap and PostgreSQL, users can log, rate and review books they have read. All book information and covers images are provided by The Open Library API.

## Screenshots

![Homepage](<public/assets/Captura de pantalla 2025-03-20 192019.png>)
![book-details page](<public/assets/Captura de pantalla 2025-03-20 192048.png>)

## To run this in your personal machine:

-   Git clone this repository
-   Run `npm i` in your terminal to install all the necessary node packages
-   You will need to have [postgresql installed along with pgAdmin 4](<(https://www.postgresql.org/download/)>)
    -   Create a new database in pgadmin called **bookNotes**
    -   Use the sql commands found in the [queries file](queries.sql) to create the table books, along with the necessary columns.
    -   To connect the server to your postgres database you can either make a `.env` file to store your user, password, database name, host and port. Or simply write them inside the code
-   Now you can start the server by typing in your terminal `node index.js` or `nodemon index.js`
-   Next go to `http://localhost:3000` in your browser and that's it
