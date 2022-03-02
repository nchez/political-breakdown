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
app.use(express.static("public"));
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

// make class for officials

class official {
  constructor(name, position, state, party) {
    this.name = name;
    this.position = position;
    this.state = state;
    this.party = party;
  }
}

// grab all current legislators and store in array
fs.readFile("./Resources/legislators-current.json", "utf8", (err, data) => {
  currentFeds = [];
  const jsonCurrent = JSON.parse(data);
  for (let i = 0; i < jsonCurrent.length; i++) {
    currentFeds.push(
      new official(
        jsonCurrent[i].name.first + " " + jsonCurrent[i].name.last,
        jsonCurrent[i].terms[jsonCurrent[i].terms.length - 1].type,
        jsonCurrent[i].terms[jsonCurrent[i].terms.length - 1].state,
        jsonCurrent[i].terms[jsonCurrent[i].terms.length - 1].party
      )
    );
  }
});

fs.readFile("./Resources/nasdaq-listed-stocks.json", "utf8", (err, data) => {
  nasStocks = [];
  const jsonNAS = JSON.parse(data);
  for (let i = 0; i < jsonNAS.length; i++) {
    nasStocks.push(jsonNAS[i]);
  }
});

// populate officials table

// QUERY WITH QUIV

// Set up quiver url and headers
const url = "https://api.quiverquant.com/beta/historical/congresstrading/aapl";
const config = {
  headers: {
    accept: "application/json",
    "X-CSRFToken":
      "TyTJwjuEC7VV7mOqZ622haRaaUr0x0Ng4nrwSRFKQs7vdoBcJlK9qjAS69ghzhFu",
    Authorization: "Token " + process.env.QUIV_API_KEY,
  },
};

// axios.get(url, config).then((response) => {
//   console.log(response.data[response.data.length - 1]);
// });
// ----------------------------------------------------

// CONTROLLERS
app.use("/users", require("./controllers/users.js"));
app.use("/officials", require("./controllers/officials.js"));

// ROUTES
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// check for an env PORT, otherwise use 8000
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Auth app running on ${PORT}`);
});
