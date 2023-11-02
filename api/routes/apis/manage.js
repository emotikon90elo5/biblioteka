const express = require("express");
const router = express.Router();
const mysql = require("mysql")
const addRouter = require("./manage/add")
const { isNotUndifined, redirectWithText, getOldValue, getPupilID, getBookID, isRented } = require("./manage/manager")
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
router.use("/add", addRouter)


router.post("/rent", async ({ session: { SchoolID }, body }, res) => {
  const { localID, firstname, lastname, classID } = body;
  let message;

  if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "rent");

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
  if (rented != false) return redirectWithText(res, message, getOldValue(Object.assign(body, { messagetype: "err" })), "rent");

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
  if (rentValue != true) return redirectWithText(res, message, getOldValue(Object.assign(body, { messagetype: "err" })), "rent");

  return redirectWithText(res, 'Pomyślnie wyporzyczono', getOldValue({ messagetype: "success" }), "rent");
})

//rent
const rent = async (localID, firstName, lastName, classID, schoolID) => {
  return new Promise(async (res) => {
    let pupilID = await getPupilID(firstName, lastName, classID)
    let bookID = await getBookID(schoolID, localID)
    if (pupilID == "dberr" || pupilID == "pupilNotExist") return res(pupilID)
    if (bookID == "dberr" || bookID == "bookNotExist") return res(bookID)
    console.log(bookID)
    con.query(`INSERT INTO Rents(Pupils_ID, Book_ID) VALUES (${pupilID}, ${bookID});`, (err, rows, fields) => {
      if (err) return res("dberr");
      res(true)
    })
  })
}

exports.router = router