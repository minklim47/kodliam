const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = (connection, secretKey) => {
  router.post("/", (req, res) => {
    const { emailOrName, password } = req.body;

    // console.log("Received login request. Email/Name:", emailOrName, "Password:", password);

    // Perform database query to retrieve the user with the given email or name
    const sqlSelect = "SELECT * FROM user WHERE email = ? OR name = ?";
    connection.query(sqlSelect, [emailOrName, emailOrName], (err, results) => {
      if (err) {
        console.error("Error executing the SQL query: ", err);
        res.sendStatus(500);
      } else {
        // console.log("Query results:", results);

        if (results.length === 0) {
          // User with the given email or name not found
          console.log("User not found.");
          res.sendStatus(401);
        } else {
          const user = results[0];
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.error("Error comparing passwords: ", err);
              res.sendStatus(500);
            } else {
              if (!isMatch) {
                // Incorrect password
                console.log("Incorrect password.");
                res.sendStatus(401);
              } else {
                // Generate JWT token
                const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "1h" });
                // console.log("Token generated:", token);
                // Set the token as a cookie in the response
                res.cookie("token", token, { httpOnly: true });
                res.sendStatus(200);
              }
            }
          });
        }
      }
    });
  });

  return router;
};
