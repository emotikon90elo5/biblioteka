var express = require("express");
var router = express.Router();
var mysql = require("mysql")
require('dotenv').config();

var con = mysql.createConnection({
  host: process.env.MYSQLhost,
  user: process.env.MYSQLuser,
  password: process.env.MYSQLpassword,
  database: process.env.MYSQLdatabase
});

con.connect()

router.use(express.json());

//Get By ID
router.get("/class", (req, res) => {

  con.query(`SELECT * FROM Class WHERE School_ID = "${req.session.SchoolID}"`, (err, rows, fields) => {
    if (err) throw err
    if (!rows[0]) return res.json({ succes: false })
    return res.json({ succes: true, data: rows })
  })

})
module.exports = router;