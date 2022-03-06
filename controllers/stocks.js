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
      res.render("stocks.ejs", {
        results: results,
        symbolName: req.body.symbol,
        name: req.body.name,
      });
    }
  );
});

router.post("/add", async (req, res) => {
  const user = await db.user.findByPk(res.locals.user.id);
  try {
    const [newStock, stockCreated] = await db.stock.findOrCreate({
      where: {
        name: req.body.name,
        symbol: req.body.symbol,
      },
    });
    await user.addStock(newStock);
  } catch (err) {
    console.log("ERROR!: ", err);
  }
  res.redirect("/stocks");
});

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

function sortResponseByTransactDate(response) {
  response.forEach((element) => {
    element.TransactionDate = Date.parse(element.TransactionDate);
  });
  response.sort((a, b) => {
    return a.TransactionDate - b.TransactionDate;
  });
  response.forEach((element) => {
    let newDate = new Date(element.TransactionDate);
    element.TransactionDate = newDate
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replaceAll("/", "-");
  });
  return response;
}

router.get("/:symbol", async (req, res) => {
  const url = `https://api.quiverquant.com/beta/historical/congresstrading/${req.params.symbol}`;
  const response = await axios.get(url, config);
  const sortResponse = response.data;
  sortResponseByTransactDate(sortResponse);
  console.log(sortResponse);
  // for (let i = 0; i < response.data.length; i++) {
  //   officialTransactArr.push(response.data[i]);
  // }
  res.render("stock_detail.ejs", {
    name: req.params.symbol,
    sortResponse: sortResponse,
  });
});

module.exports = router;
