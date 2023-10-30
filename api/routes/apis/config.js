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

router.get("/class", ({ session: { SchoolID } }, res) => {

  con.query(`SELECT ID, Name FROM Class WHERE School_ID = "${SchoolID}"`, (err, rows, fields) => {
    if (err) throw err
    if (!rows[0]) return res.json({ succes: false })
    return res.json({ succes: true, data: rows })
  })

})
router.get("/types", ({ }, res) => {

  con.query(`SELECT * FROM Type;`, (err, rows, fields) => {
    if (err) throw err
    if (!rows[0]) return res.json({ succes: false })
    return res.json({ succes: true, data: rows })
  })

})

router.get("/shelf", ({ session: { SchoolID } }, res) => {

  con.query(`SELECT Bookcases.Name AS BookcaseName, Shelves.Name  AS ShelfName, Shelves.ID AS ID FROM Bookcases 
  INNER JOIN Shelves ON Shelves.Bookcase_ID = Bookcases.ID WHERE School_ID = "${SchoolID}";`, (err, rows, fields) => {
    if (err) throw err
    if (!rows[0]) return res.json({ succes: false })
    return res.json({ succes: true, data: rows })
  })

})
router.get("/bookcase", ({ session: { SchoolID } }, res) => {

  con.query(`SELECT ID,Name FROM Bookcases WHERE School_ID = "${SchoolID}";`, (err, rows, fields) => {
    if (err) throw err
    if (!rows[0]) return res.json({ succes: false })
    return res.json({ succes: true, data: rows })
  })

})
router.get("/books", ({ session: { SchoolID } }, res) => {

  con.query(`SELECT Books.ID AS ID, Books.Shelves_ID AS Shelves_ID, Books.Title AS Title, Books.Author as Author, Books.PublishingHouse AS PublishingHouse, Books.AgeCategory as AgeCategory, Books.Type_ID as Type_ID, Books.LocalID AS LocalID FROM Books INNER JOIN Shelves INNER join Bookcases ON Books.Shelves_ID = Shelves.ID AND Shelves.Bookcase_ID = Bookcases.ID WHERE Bookcases.School_ID = "${SchoolID}";`, (err, rows, fields) => {
    if (err) throw err
    if (!rows[0]) return res.json({ succes: false })
    return res.json({ succes: true, data: rows })
  })

})
module.exports = router;