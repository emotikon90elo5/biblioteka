var express = require("express");
var router = express.Router();
require('dotenv').config();

router.get("/about", (req, res) => {
  res.render("about")
})

module.exports = router;