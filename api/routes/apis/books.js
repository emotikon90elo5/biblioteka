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

const specialChars = /['"`]/g
const notNumbers = /\D/g

//Get By ID
router.get("/Book/:id", ({ params: { id } }, res) => {

  con.query(`SELECT * FROM Books WHERE ID = "${id.replace(notNumbers, "")}"`, (err, rows, fields) => {
    if (err) throw err
    if (!rows[0]) return res.json({ succes: false })
    res.json({ succes: true, data: rows[0] })
  })

})
router.get("/Shelf/:id", ({ params: { id } }, res) => {

  con.query(`SELECT * FROM Books WHERE Shelves_ID = "${id.replace(notNumbers, "")}"`, (err, rows, fields) => {
    if (err) throw err

    res.json({ succes: true, data: rows })
  })

})
router.get("/Bookcase/:id", ({ params: { id } }, res) => {

  con.query(`SELECT * FROM Books INNER JOIN Shelves ON Shelves_ID = Shelves.ID WHERE Shelves.Bookcase_ID="${id.replace(notNumbers, "")}"`, (err, rows, fields) => {
    if (err) throw err

    res.json({ succes: true, data: rows })
  })

})
router.get("/School/:id", ({ params: { id } }, res) => {

  con.query(`SELECT * FROM Books INNER JOIN Shelves ON Shelves_ID = Shelves.ID INNER JOIN Bookcases ON Bookcases.ID = Shelves.Bookcase_ID  WHERE Bookcases.School_ID="${id.replace(notNumbers, "")}"`, (err, rows, fields) => {
    if (err) throw err

    res.json({ succes: true, data: rows })
  })

})

router.get("/find/School/:id", ({ params: { id }, query: { title, author, publishinghouse, agecategory } }, res) => {

  con.query(`SELECT * FROM Books ` +
    `INNER JOIN Shelves ON Shelves_ID = Shelves.ID ` +
    `INNER JOIN Bookcases ON Bookcases.ID = Shelves.Bookcase_ID ` +
    `WHERE Bookcases.School_ID="${id.replace(notNumbers, "")}" ` +
    `AND Title LIKE "${title ? title.replace(specialChars, "") : ""}%" ` +
    `AND Author LIKE "${author ? author.replace(specialChars, "") : ""}%" ` +
    `AND PublishingHouse LIKE "${publishinghouse ? publishinghouse.replace(specialChars, "") : ""}%" ` +
    `AND AgeCategory LIKE "${agecategory ? agecategory.replace(specialChars, "") : ""}%";`, (err, rows, fields) => {
      if (err) throw err

      res.json({ succes: true, data: rows })
    })
})

module.exports = router;