const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connection = mysql.createConnection({
    host: "db.cshack.site",
<<<<<<< Updated upstream
    port: "3106",
    user: "group05",
=======
    port: "3306",
    user: "ggroup05",
>>>>>>> Stashed changes
    password: "205223224",
    database: "Hackathon_G5",
});

connection.connect((err) => {
    if (!err) {
        console.log("\nDatabase connected\n");
    } else {
        console.error("Error connecting to database", err);
    }
});

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req, res) => {
    res.send("Hello World!!!");
});

const loginRoute = require('./Routes/endpoint_login')(connection);
const signupRoute = require('./Routes/endpoint_signup')(connection);

app.use('/login', loginRoute);
app.use('/signup', loginRoute);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
