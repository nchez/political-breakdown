let express = require("express");
let db = require("../models");
let router = express.Router();
const axios = require("axios");
const app = express(); // create an express instance
const fs = require("fs");

// DECLARE VARIABLES FOR RENDERING
let nameField;
let userStocksArr = [];
let stocksArr = [];
let results = [];
let name = "";
let symbolName = "";

// class constructor for stock
class stock {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
  }
}

function createStock(response) {
  stocksArr = [];
  for (let i = 0; i < response.results.length; i++) {
    const name = response.result[i].name;
    const symbol = response.symbol;
    const createStock = new official(name, symbol);
    stocksArr.push(createStock);
  }
  return stocksArr;
}

// const urlFinn = `https://finnhub.io/api/v1/search?q=Apple&token=${process.env.FINN_API_KEY}`;
// const responseFinn = await axios.get(urlFinn);
// console.log(response.data.result);
fs.readFile(
  "./Resources/nasdaq-listed-stocks.json",
  "utf8",
  async (err, data) => {
    await JSON.parse(data);
  }
);

router.get("/", (req, res) => {
  res.render("stocks.ejs", {
    results: results,
    name: name,
    symbolName: symbolName,
  });
});

// fs.readFile(
//   "./Resources/nasdaq-listed-stocks.json",
//   "utf8",
//   async (err, data) => {
//     const nasStocks = await JSON.parse(data);
//     const results = nasStocks.filter((element) =>
//       element["Company Name"].toLowerCase().includes("appl")
//     );
//   }
// );

router.post("/", (req, res) => {
  userStocksArr = [];
  // const userStocks = res.locals.user.getStocks();
  // for (let i = 0; i < userStocks.length; i++) {
  //   userStocksArr.push(userStocks[i].dataValues.name);
  // }
  fs.readFile(
    "./Resources/nasdaq-listed-stocks.json",
    "utf8",
    async (err, data) => {
      const nasStocks = await JSON.parse(data);
      const results = nasStocks.filter((element) =>
        element["Company Name"].toLowerCase().includes(req.body.name)
      );
      console.log(req.body.name);
      res.render("stocks.ejs", {
        results: results,
        symbolName: req.body.symbol,
        name: req.body.name,
      });
    }
  );
});

module.exports = router;
