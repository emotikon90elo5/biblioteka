var express = require("express");
var router = express.Router();
var mysql = require("mysql")
var BooksRouter = require("./apis/books")
var AuthRouter = require("./apis/auth")
var ConfigRouter = require("./apis/config")
require('dotenv').config();

// var con = mysql.createConnection({
//     host: process.env.MYSQLhost ,
//     user: process.env.MYSQLuser ,
//     password: process.env.MYSQLpassword ,
//     database: process.env.MYSQLdatabase 
//   });

// con.connect()
router.use("/books", BooksRouter);
router.use("/auth", AuthRouter);
router.use("/config", (req, res, next)=>{
  if(!req.session.SchoolID) return res.json({succes: false})
  next()
}, ConfigRouter);
router.all("*", (req, res) => {
  res.statusCode = 404
  res.json({ succes: false, data: "Not found" })
})

module.exports = router;