var express = require("express");
var router = express.Router();
require('dotenv').config();

router.get("/", (req, res) => {
  res.render("main")
})

module.exports = router;