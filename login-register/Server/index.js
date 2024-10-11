const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Typo corrected

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "loginsystem",
});

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

// User Registration
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send({ message: "Username and password required" });
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error(err);
      return res.send({ message: "Error hashing password" });
    }

    db.execute(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        if (err) {
          res.send({ message: "Error during registration" });
        } else {
          res.send({ message: "User registered successfully!" });
        }
      }
    );
  });
});

// Check if the user is logged in
app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send({ message: "Please enter username and password" });
  }

  db.execute(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        return res.send({ message: "Error querying database" });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist!" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
