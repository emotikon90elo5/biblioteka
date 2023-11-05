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

router.get("/",  ({session: {SchoolID}}, res) => {
  res.render("main", {logged: SchoolID ? true : false })
})

router.get("/about", ({session: {SchoolID}}, res) => {
  res.render("about", {logged: SchoolID ? true : false })
  
})
router.get("/locate", ({session: {SchoolID}}, res) => {
  res.render("locate", {logged: SchoolID ? true : false })
  
})
router.get("/school/:id", (req, res) => {
  res.render("school",{id:req.params.id, data: req.query})
})
module.exports = router;