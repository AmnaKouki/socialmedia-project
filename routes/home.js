const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")

router.get("/", (req, res) => {
  res.render("../views/pages/index");
});
router.get("/createuser", userController.createUser);
router.put("/updateuser", userController.updateUser)

module.exports = router;
