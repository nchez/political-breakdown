let express = require("express");
let db = require("../models");
let router = express.Router();

router.post("/", (req, res) => {
  db.article
    .create({
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId,
    })
    .then((post) => {
      res.redirect("/");
    })
    .catch((error) => {
      res.status(400).render("main/404");
    });
});
