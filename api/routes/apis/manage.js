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

router.post("/rent", async ({ session: { SchoolID }, body: { localID, firstname, lastname, classID } }, res) => {
  let rented = await getRented(localID.replace(notNumbers, ""))
  if (rented == "dberr") return redirectWithText(res, 'Błąd połączenia, spróbuj ponownie później', getOldValue(localID, firstname, lastname, classID));
  else if (rented == "bookNotExist") return redirectWithText(res, 'Taki numer książki nie istnieje', getOldValue(localID, firstname, lastname, classID));
  else if (rented) return redirectWithText(res, 'Ta książka jest już wyporzyczona', getOldValue(localID, firstname, lastname, classID));
  else {
    let rentValue = await rent(localID, firstname, lastname, classID, SchoolID)
    if (rentValue == "bookNotExist") return redirectWithText(res, 'Taki numer książki nie istnieje', getOldValue(localID, firstname, lastname, classID));
    else if (rentValue == "pupilNotExist") return redirectWithText(res, 'Taki uczeń nie istnieje', getOldValue(localID, firstname, lastname, classID));
    else if (rentValue == "dberr") return redirectWithText(res, 'Błąd połączenia, spróbuj ponownie później', getOldValue(localID, firstname, lastname, classID));
    return redirectWithText(res, 'Pomyślnie wyporzyczono', "&type=succes");
  }
})

//getRent
const getRented = (localID) => {
  return new Promise((res) => {
    con.query(`SELECT Rented FROM Books INNER JOIN Rents ON Book_ID=Books.ID WHERE LocalID="${localID}"; `, (err, rows, fields) => {
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

const getOldValue = (localID, firstname, lastname, classID) => {
  return (localID ? "&localID=" + localID : "") + (firstname ? "&firstname=" + firstname : "") + (lastname ? "&lastname=" + lastname : "") + (classID ? "&classID=" + classID : "") + "&type=err"
}

const redirectWithText = (res, message, args) => {
  res.redirect('/admin/rent?message=' + message + args);
}

module.exports = router;