const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const cryptojs = require("crypto-js");
require("dotenv").config();

let userOfficialsArr = [];
let userStocksArr = [];

// class constructor for official
class official {
  constructor(name, position, state, party, id) {
    this.name = name;
    this.position = position;
    this.state = state;
    this.party = party;
    this.id = id;
  }
}

class stock {
  constructor(name, symbol) {
    this.name = name;
    this.symbol = symbol;
  }
}

router.get("/profile", async (req, res) => {
  userOfficialsArr = [];
  userStocksArr = [];
  const user = await db.user.findByPk(res.locals.user.id);
  const userOfficials = await user.getOfficials();
  for (let i = 0; i < userOfficials.length; i++) {
    const name = userOfficials[i].dataValues.name;
    const position = userOfficials[i].dataValues.position;
    const state = userOfficials[i].dataValues.state;
    const party = userOfficials[i].dataValues.party;
    const id = userOfficials[i].dataValues.id;
    const newOfficial = new official(name, position, state, party, id);
    userOfficialsArr.push(newOfficial);
  }
  const userStocks = await user.getStocks();
  for (let i = 0; i < userStocks.length; i++) {
    const name = userStocks[i].dataValues.name;
    const symbol = userStocks[i].dataValues.symbol;
    const newOfficial = new stock(name, symbol);
    userStocksArr.push(newOfficial);
  }
  console.log(userStocksArr);
  res.render("users/profile.ejs", {
    userOfficialsArr: userOfficialsArr,
    userStocksArr: userStocksArr,
  });
});

router.get("/new", (req, res) => {
  res.render("users/new.ejs");
});

router.post("/", async (req, res) => {
  const [newUser, created] = await db.user.findOrCreate({
    where: { email: req.body.email },
  });
  if (!created) {
    console.log("User already exists");
    // render the login page and send an appropriate message
  } else {
    // hash the user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    newUser.password = hashedPassword;
    await newUser.save();

    // encrypt the user id via AES
    const encryptedUserId = cryptojs.AES.encrypt(
      newUser.id.toString(),
      process.env.SECRET
    );
    const encryptedUserIdString = encryptedUserId.toString();
    // store the encrypted id in the cookie of the res obj
    res.cookie("userId", encryptedUserIdString);
    // redirect back to home page
    res.redirect("/");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs", { error: null });
});

router.post("/login", async (req, res) => {
  const user = await db.user.findOne({ where: { email: req.body.email } });
  if (!user) {
    // didn't find user in the database
    console.log("user not found!");
    res.render("users/login.ejs", { error: "Invalid email/password" });
  } else if (!bcrypt.compareSync(req.body.password, user.password)) {
    // found user but password was wrong
    console.log("Incorrect Password");
    res.render("users/login.ejs", { error: "Invalid email/password" });
  } else {
    console.log("logging in the user!");
    // encrypt the user id via AES
    const encryptedUserId = cryptojs.AES.encrypt(
      user.id.toString(),
      process.env.SECRET
    );
    const encryptedUserIdString = encryptedUserId.toString();
    console.log(encryptedUserIdString);
    // store the encrypted id in the cookie of the res obj
    res.cookie("userId", encryptedUserIdString);
    // redirect back to home page
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  console.log("logging out");
  res.clearCookie("userId");
  res.redirect("/");
});

// export all these routes to the entry point file
module.exports = router;
