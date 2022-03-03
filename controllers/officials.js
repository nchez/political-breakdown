let express = require("express");
let db = require("../models");
let router = express.Router();
const axios = require("axios");
const app = express(); // create an express instance
const fs = require("fs");

let nameArray = [];
const statesArr = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];
let nameField;

router.get("/", (req, res) => {
  res.render("officials.ejs", { statesArr: statesArr, nameArray, nameField });
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

router.post("/", (req, res) => {
  nameArray = [];
  fs.readFile("./Resources/openCongress.json", "utf8", (err, data) => {
    const response = JSON.parse(data);
    for (let i = 0; i < response.results.length; i++) {
      nameArray.push(response.results[i].name);
    }
    res.render("officials.ejs", {
      statesArr: statesArr,
      nameArray: nameArray,
      nameField: req.body.name,
    });
  });
});

router.post("/add", async (req, res) => {
  try {
    const [newOfficial, officialCreated] = await db.official.findOrCreate({
      where: {
        name: req.body.name,
      },
    });
    console.log(req.body.name);
    const user = await db.user.findByPk(res.locals.user.id);
    await user.addOfficial(newOfficial);
  } catch (err) {
    console.log("ERROR!: ", err);
  }
  res.render("officials.ejs", {
    statesArr: statesArr,
    nameArray,
    nameField,
  });
});

module.exports = router;
