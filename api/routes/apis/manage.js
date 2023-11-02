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
  let message;

  if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { type: "err" })), "rent");

  let rented = await isRented(localID.replace(notNumbers, ""), SchoolID)

  switch (rented) {
    case "dberr":
      message = "Błąd połączenia, spróbuj ponownie później";
      break;
    case "bookNotExist":
      message = "Taki numer książki nie istnieje"
      break;
    case true:
      message = "Ta książka jest już wyporzyczona"
      break;
  }
  if (rented != false) return redirectWithText(res, message, getOldValue(Object.assign(body, { type: "err" })), "rent");

  let rentValue = await rent(localID.replace(notNumbers, ""), firstname.replace(specialChars, ""), lastname.replace(specialChars, ""), classID.replace(notNumbers, ""), SchoolID)

  switch (rentValue) {
    case "dberr":
      message = "Błąd połączenia, spróbuj ponownie później";
      break;
    case "bookNotExist":
      message = "Taki numer książki nie istnieje"
      break;
    case "pupilNotExist":
      message = "Taki uczeń nie istnieje"
      break;
  }
  if (rentValue != true) return redirectWithText(res, message, getOldValue(Object.assign(body, { type: "err" })), "rent");

  return redirectWithText(res, 'Pomyślnie wyporzyczono', getOldValue({ type: "success" }), "rent");
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

const isNotUndifined = (obj) => {
  let r = false;
  Object.entries(obj).forEach((v) => {
    if (typeof v[1] == "undefined" && v[1] == "") r = true
  })
  return r
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

const redirectWithText = (res, message, args, subpage) => {
  res.redirect(`/admin/${subpage}?message=` + message + args);
}

module.exports = router;