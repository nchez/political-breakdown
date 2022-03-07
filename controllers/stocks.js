let express = require("express");
let db = require("../models");
let router = express.Router();
const axios = require("axios");
const app = express(); // create an express instance
const fs = require("fs");
const methodOverride = require("method-override");

router.use(methodOverride("_method")); // do we need this
router.use(express.urlencoded({ extended: false })); // do we need this

// DECLARE VARIABLES FOR RENDERING
let nameField;
let userStocksArr = [];
let stocksArr = [];
let results = [];
let name = "";
let symbolName = "";

// class constructor for stock and fcn to create array of stock objects
// NOT NEEDED??
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
    const createStock = new stock(name, symbol);
    stocksArr.push(createStock);
  }
  return stocksArr;
}
// Sort Quiver API Results by Transaction Date (most recent to oldest)
function sortResponseByTransactDate(response) {
  response.forEach((element) => {
    element.TransactionDate = Date.parse(element.TransactionDate);
  });
  response.sort((a, b) => {
    return b.TransactionDate - a.TransactionDate;
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

// READ ROUTE FOR STOCK SEARCH
router.get("/", async (req, res) => {
  userStocksArr = [];
  const user = await db.user.findByPk(res.locals.user.id);
  const userStocks = await user.getStocks();
  for (let i = 0; i < userStocks.length; i++) {
    userStocksArr.push(userStocks[i].dataValues.name);
  }
  res.render("stocks.ejs", {
    results: results,
    name: req.body.name,
    symbolName: req.body.symbolName,
    userStocksArr: userStocksArr,
  });
});

router.post("/", async (req, res) => {
  userStocksArr = [];
  const user = await db.user.findByPk(res.locals.user.id);
  const userStocks = await user.getStocks();
  for (let i = 0; i < userStocks.length; i++) {
    userStocksArr.push(userStocks[i].dataValues.name);
  }
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
        userStocksArr: userStocksArr,
      });
    }
  );
});

// CREATE -- ADD STOCK TO USER's WATCHLIST
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

// READ ROUTE FOR SPECIFIC STOCK
const config = {
  headers: {
    accept: "application/json",
    "X-CSRFToken":
      "TyTJwjuEC7VV7mOqZ622haRaaUr0x0Ng4nrwSRFKQs7vdoBcJlK9qjAS69ghzhFu",
    Authorization: "Token " + process.env.QUIV_API_KEY,
  },
};
router.get("/:symbol", async (req, res) => {
  const url = `https://api.quiverquant.com/beta/historical/congresstrading/${req.params.symbol}`;
  const response = await axios.get(url, config);
  const sortResponse = response.data;
  sortResponseByTransactDate(sortResponse);
  res.render("stock_detail.ejs", {
    name: req.params.symbol,
    sortResponse: sortResponse,
  });
});

// DELETE ROUTE
router.delete("/:symbol", async (req, res) => {
  const user = await db.user.findByPk(res.locals.user.id);
  try {
    const [deleteStock, stockCreated] = await db.stock.findOrCreate({
      where: {
        symbol: req.params.symbol,
      },
    });
    await user.removeStock(deleteStock);
  } catch (err) {
    console.log("ERROR!: ", err);
  }
  res.redirect("/users/profile");
});

module.exports = router;
