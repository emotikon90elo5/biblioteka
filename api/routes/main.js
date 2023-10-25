var express = require("express");
var router = express.Router();
require('dotenv').config();
var mysql = require("mysql")

var con = mysql.createConnection({
  host: process.env.MYSQLhost,
  user: process.env.MYSQLuser,
  password: process.env.MYSQLpassword,
  database: process.env.MYSQLdatabase
});

router.get("/",  (req, res) => {
  res.render("main")
})

router.get("/about", (req, res) => {
  res.render("about")
  
})
module.exports = router;