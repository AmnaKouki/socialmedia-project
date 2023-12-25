const express = require("express");
const router = express.Router();


router.get("/login", function (req, res) {
  res.render("../views/pages/login");
});

router.get("/signup", function (req, res) {
  res.render("../views/pages/signup");
});

router.get("/test", function (req, res) {
    res.send({ username: 'Amna' }) // sending JSON
  });

module.exports = router;
