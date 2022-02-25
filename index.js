const express = require("express"); // import express
const app = express(); // create an express instance
const ejsLayouts = require("express-ejs-layouts"); // import ejs layouts
require("dotenv").config(); // allows us to access env vars
const cookieParser = require("cookie-parser");
const cryptoJS = require("crypto-js");
const db = require("./models/index.js");

// MIDDLEWARE
app.set("view engine", "ejs"); // set the view engine to ejs
app.use(ejsLayouts); // tell express we want to use layouts
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CUSTOM LOGIN MIDDLEWARE
app.use(async (req, res, next) => {
  if (req.cookies.userId) {
    const decryptedId = cryptoJS.AES.decrypt(
      req.cookies.userId,
      process.env.SECRET
    );
    const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8);
    const user = await db.user.findByPk(decryptedIdString);
    res.locals.user = user;
  } else {
    res.locals.user = null;
  }
  next();
});

// CONTROLLERS
app.use("/users", require("./controllers/users.js"));

// ROUTES
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// check for an env PORT, otherwise use 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Auth app running on ${PORT}`);
});
