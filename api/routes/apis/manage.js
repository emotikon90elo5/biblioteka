const express = require("express");
const router = express.Router();
const mysql = require("mysql")
require('dotenv').config();

let con = mysql.createConnection({
  host: process.env.MYSQLhost,
  user: process.env.MYSQLuser,
  password: process.env.MYSQLpassword,
  database: process.env.MYSQLdatabase
});
con.connect()

const specialChars = /['"`]/g
const notNumbers = /\D/g

router.use(express.json());

router.post("/rent", async ({ session: { SchoolID }, body }, res) => {
  const { localID, firstname, lastname, classID } = body;
  if (typeof localID == "undefined" || typeof firstname == "undefined" || typeof lastname == "undefined" || typeof classID == "undefined") return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { type: "err" })));
  let rented = await isRented(localID.replace(notNumbers, ""), SchoolID)
  if (rented == "dberr") return redirectWithText(res, 'Błąd połączenia, spróbuj ponownie później', getOldValue(Object.assign(body, { type: "err" })));
  else if (rented == "bookNotExist") return redirectWithText(res, 'Taki numer książki nie istnieje', getOldValue(Object.assign(body, { type: "err" })));
  else if (rented) return redirectWithText(res, 'Ta książka jest już wyporzyczona', getOldValue(Object.assign(body, { type: "err" })));
  else {
    let rentValue = await rent(localID, firstname, lastname, classID, SchoolID)
    if (rentValue == "bookNotExist") return redirectWithText(res, 'Taki numer książki nie istnieje', getOldValue(Object.assign(body, { type: "err" })));
    else if (rentValue == "pupilNotExist") return redirectWithText(res, 'Taki uczeń nie istnieje', getOldValue(Object.assign(body, { type: "err" })));
    else if (rentValue == "dberr") return redirectWithText(res, 'Błąd połączenia, spróbuj ponownie później', getOldValue(Object.assign(body, { type: "err" })));
    return redirectWithText(res, 'Pomyślnie wyporzyczono', "&type=succes");
  }
})

//getRent
const isRented = (localID, schoolID) => {
  return new Promise((res) => {
    con.query(`SELECT Rented FROM Books INNER JOIN Rents ON Book_ID=Books.ID INNER JOIN Shelves ON Books.Shelves_ID=Shelves.ID 
    INNER JOIN Bookcases ON Shelves.Bookcase_ID = Bookcases.ID 
    WHERE Bookcases.School_ID=${schoolID} AND LocalID="${localID}"; `, (err, rows, fields) => {
      if (err) return res("dberr")
      if (!rows[0]) return res("bookNotExist")
      rows.forEach(element => {
        if (element.Rented == 1) return res(true)
      });
      res(false)
    })
  })
}


//rent
const rent = async (localID, firstName, lastName, classID, schoolID) => {
  return new Promise(async (res) => {
    let pupilID = await getPupilID(firstName, lastName, classID)
    let bookID = await getBookID(schoolID, localID)
    if (pupilID == "dberr" || pupilID == "pupilNotExist") return res(pupilID)
    if (bookID == "dberr" || bookID == "bookNotExist") return res(bookID)
    console.log(bookID)
    con.query(`INSERT INTO Rents(Pupils_ID, Book_ID) VALUES (${pupilID}, ${bookID});`, (err, rows, fields) => {
      if (err) throw err;
      res(true)
    })
  })
}

const getPupilID = (firstName, lastName, classID) => {
  return new Promise((res) => {
    con.query(`SELECT Pupils.ID AS ID FROM Pupils WHERE Pupils.FirstName = "${firstName.replace(specialChars, "")}" 
                                              AND Pupils.LastName = "${lastName.replace(specialChars, "")}" 
                                              AND Pupils.Class_ID= "${classID.replace(notNumbers, "")}";`
      , (err, rows, fields) => {
        if (err) return res("dberr");
        if (!rows[0]) return res("pupilNotExist")
        res(rows[0].ID)
      })
  })
}

const getBookID = (schoolID, localID) => {
  return new Promise((res) => {
    con.query(`SELECT Books.ID AS ID FROM Books INNER JOIN Shelves ON Books.Shelves_ID=Shelves.ID 
    INNER JOIN Bookcases ON Shelves.Bookcase_ID = Bookcases.ID 
    WHERE Bookcases.School_ID = "${schoolID}" AND Books.LocalID="${localID}"`
      , (err, rows, fields) => {
        if (err) res("dberr");
        if (!rows[0]) res("bookNotExist")
        res(rows[0].ID)
      })
  })
}

const getOldValue = (values) => {
  let str = "";
  Object.entries(values).forEach((v) => {
    if (typeof v[1] != "undefined" && v[1] != "") str += "&" + v[0] + "=" + v[1]
  })
  return str;
}

const redirectWithText = (res, message, args) => {
  res.redirect('/admin/rent?message=' + message + args);
}

module.exports = router;