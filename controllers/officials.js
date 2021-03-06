let express = require("express");
let db = require("../models");
let router = express.Router();
const axios = require("axios");
const app = express(); // create an express instance
const fs = require("fs");

// DECLARE VARIABLES FOR RENDERING
let nameArray = [];
let nameField;
let userOfficialsArr = [];
let officialsArr = [];

// class constructor for official
class official {
  constructor(name, state, party) {
    this.name = name;
    this.state = state;
    this.party = party;
  }
}

function createOfficials(response) {
  officialsArr = [];
  for (let i = 0; i < response.data.results.length; i++) {
    if (
      !response.data.results[i].current_role ||
      response.data.results[i].jurisdiction.classification === "municipality"
    ) {
      continue;
    } else {
      const name = response.data.results[i].name;
      const state = response.data.results[i].jurisdiction.name;
      const party = response.data.results[i].party[0];
      const createOfficial = new official(name, state, party);
      officialsArr.push(createOfficial);
    }
  }
  return officialsArr;
}

router.get("/", async (req, res) => {
  userOfficialsArr = [];
  const user = await db.user.findByPk(res.locals.user.id);
  const userOfficials = await user.getOfficials();
  for (let i = 0; i < userOfficials.length; i++) {
    userOfficialsArr.push(userOfficials[i].dataValues.name);
  }
  res.render("officials.ejs", {
    nameArray,
    nameField,
    officialsArr: officialsArr,
    userOfficialsArr: userOfficialsArr,
  });
});

// CREATE FUNCTINON FOR CREATING NAMEARRAY AND FILTERING BY STATE
// function filterCongressMembers(response, state, position, party) {
//     for (let i = 0; i < response.data.results.length; i++) {
//         nameArray.push(response.data.results[i].name);
//       }
//     if (state!= null) {
//         for
//     }
// }

/* COMMENTED OUT DUE TO 504 (too many requests)
router.post("/", async (req, res) => {
  nameArray = [];
  const config = {
    headers: {
      accept: "application/json",
    },
  };
  const url = `https://v3.openstates.org/people?name=${req.body.name}&page=1&per_page=25&apikey=${process.env.OPEN_API_KEY}`;
  try {
    const response = await axios.get(url, config);
    const jResponse = JSON.parse(response);
    console.log(jResponse);
    for (let i = 0; i < response.data.results.length; i++) {
      nameArray.push(response.data.results[i].name);
    }
    res.render("officials.ejs", {
      statesArr: statesArr,
      nameArray: nameArray,
      nameField: req.body.name,
    });
  } catch (err) {
    console.log("ERROR!: ", err);
  }
});
*/

router.post("/", async (req, res) => {
  userOfficialsArr = [];
  const user = await db.user.findByPk(res.locals.user.id);
  const userOfficials = await user.getOfficials();
  for (let i = 0; i < userOfficials.length; i++) {
    userOfficialsArr.push(userOfficials[i].dataValues.name);
  }
  officialsArr = [];
  const config = {
    headers: {
      accept: "application/json",
    },
  };
  const url = `https://v3.openstates.org/people?name=${req.body.name}&page=1&per_page=50&apikey=${process.env.OPEN_API_KEY}`;
  try {
    const response = await axios.get(url, config);
    createOfficials(response);
    console.log(officialsArr);
    res.render("officials.ejs", {
      userOfficialsArr: userOfficialsArr,
      officialsArr: officialsArr,
      nameField: req.body.name,
    });
  } catch (err) {
    console.log("ERROR!: ", err);
  }
  /*
  fs.readFile("./Resources/openCongress.json", "utf8", (err, data) => {
    const response = JSON.parse(data);
    createOfficials(response);
    res.render("officials.ejs", {
      officialsArr: officialsArr,
      nameField: req.body.name,
      userOfficialsArr: userOfficialsArr,
    });
  });
  */
});

router.post("/add", async (req, res) => {
  const user = await db.user.findByPk(res.locals.user.id);
  try {
    const [newOfficial, officialCreated] = await db.official.findOrCreate({
      where: {
        name: req.body.name,
        position: req.body.position,
        state: req.body.state,
        party: req.body.party,
      },
    });
    await user.addOfficial(newOfficial);
  } catch (err) {
    console.log("ERROR!: ", err);
  }
  res.redirect("/officials");
});

const url = "https://api.quiverquant.com/beta/live/congresstrading"; //https://api.quiverquant.com/beta/historical/congresstrading/aapl";
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

router.get("/:name", async (req, res) => {
  let officialTransactArr = [];
  const name = req.params.name;
  const response = await axios.get(url, config);
  for (let i = 0; i < response.data.length; i++) {
    if (response.data[i].Representative === name) {
      officialTransactArr.push(response.data[i]);
    } else {
      continue;
    }
  }
  res.render("official_detail.ejs", {
    name: req.params.name,
    officialTransactArr: officialTransactArr,
  });
});

module.exports = router;
