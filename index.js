const express = require("express"); // import express
const app = express(); // create an express instance
const ejsLayouts = require("express-ejs-layouts"); // import ejs layouts
require("dotenv").config(); // allows us to access env vars
const cookieParser = require("cookie-parser");
const cryptoJS = require("crypto-js");
const db = require("./models/index.js");
const fs = require("fs");
const { json } = require("express/lib/response");
const axios = require("axios");
require("dotenv").config();

// MIDDLEWARE
app.set("view engine", "ejs"); // set the view engine to ejs
app.use(ejsLayouts); // tell express we want to use layouts
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static("public")); //access to public css/js folders

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

// ROUTES
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// CONTROLLERS
app.use("/users", require("./controllers/users.js"));
app.use("/officials", require("./controllers/officials.js"));
app.use("/stocks", require("./controllers/stocks.js"));

// check for an env PORT, otherwise use 3002
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Auth app running on ${PORT}`);
});
