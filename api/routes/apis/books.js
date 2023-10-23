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
router.get("/Book/:id", (req, res) => {

  con.query(`SELECT * FROM Books WHERE ID = "${req.params.id}"`, (err, rows, fields) => {
    if (err) throw err

    res.json({ succes: true, data: rows[0] })
  })

})
router.get("/Shelve/:id", (req, res) => {

  con.query(`SELECT * FROM Books WHERE Shelves_ID = "${req.params.id}"`, (err, rows, fields) => {
    if (err) throw err

    res.json({ succes: true, data: rows })
  })

})
router.get("/Bookcase/:id", (req, res) => {

  con.query(`SELECT * FROM Books INNER JOIN Shelves ON Shelves_ID = Shelves.ID WHERE Shelves.Bookcase_ID="${req.params.id}"`, (err, rows, fields) => {
    if (err) throw err

    res.json({ succes: true, data: rows })
  })

})
router.get("/School/:id", (req, res) => {

  con.query(`SELECT * FROM Books INNER JOIN Shelves ON Shelves_ID = Shelves.ID INNER JOIN Bookcases ON Bookcases.ID = Shelves.Bookcase_ID  WHERE Bookcases.School_ID="${req.params.id}"`, (err, rows, fields) => {
    if (err) throw err

    res.json({ succes: true, data: rows })
  })

})

router.get("/School/", (req, res) => {
  console.log(req.session)
  if (req.session.SchoolID == undefined) {
    return res.json({ succes: false, data: "Bad auth" })
  }
  con.query(`SELECT * FROM Books INNER JOIN Shelves ON Shelves_ID = Shelves.ID INNER JOIN Bookcases ON Bookcases.ID = Shelves.Bookcase_ID  WHERE Bookcases.School_ID="${req.session.SchoolID}"`, (err, rows, fields) => {
    if (err) throw err

    res.json({ succes: true, data: rows })
  })

})

router.get("/find/School/:id", (req, res) => {

  con.query(`SELECT * FROM Books ` +
    `INNER JOIN Shelves ON Shelves_ID = Shelves.ID ` +
    `INNER JOIN Bookcases ON Bookcases.ID = Shelves.Bookcase_ID ` +
    `WHERE Bookcases.School_ID="${req.params.id}" ` +
    `AND Title LIKE "${req.query.title ? req.query.title : ""}%" ` +
    `AND Author LIKE "${req.query.author ? req.query.author : ""}%" ` +
    `AND PublishingHouse LIKE "${req.query.publishinghouse ? req.query.publishinghouse : ""}%" ` +
    `AND AgeCategory LIKE "${req.query.agecategory ? req.query.agecategory : ""}%";`, (err, rows, fields) => {
      if (err) throw err

      res.json({ succes: true, data: rows })
    })
})
router.get("/find/School/", (req, res) => {
  con.query(`SELECT * FROM Books ` +
    `INNER JOIN Shelves ON Shelves_ID = Shelves.ID ` +
    `INNER JOIN Bookcases ON Bookcases.ID = Shelves.Bookcase_ID ` +
    `WHERE Bookcases.School_ID="${req.session.SchoolID}" ` +
    `AND Title LIKE "${req.query.title ? req.query.title : ""}%" ` +
    `AND Author LIKE "${req.query.author ? req.query.author : ""}%" ` +
    `AND PublishingHouse LIKE "${req.query.publishinghouse ? req.query.publishinghouse : ""}%" ` +
    `AND AgeCategory LIKE "${req.query.agecategory ? req.query.agecategory : ""}%";`, (err, rows, fields) => {
      if (err) throw err

      res.json({ succes: true, data: rows })
    })
})

module.exports = router;