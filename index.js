const express = require("express");
const axios = require("axios");
const ejsLayouts = require("express-ejs-layouts");

const app = express();
const port = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.listen(port, () => {
  console.log("...listening on", port);
});
