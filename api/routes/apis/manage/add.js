const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const { isNotUndifined, redirectWithText, getOldValue, isRented } = require("./manager")
require("dotenv").config();

const con = mysql.createConnection({
    host: process.env.MYSQLhost,
    user: process.env.MYSQLuser,
    password: process.env.MYSQLpassword,
    database: process.env.MYSQLdatabase,
});

con.connect();

const specialChars = /['"`]/g
const notNumbers = /\D/g

router.use(express.json());

router.post("/book", async ({ session: { SchoolID }, body }, res) => {
    const { title, author, publishingHouse, ageCategory, type, shelf, localID } = body
    const rented = await isRented(localID.replace(notNumbers, ""), SchoolID)
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    if (rented == "dberr") return redirectWithText(res, "Błąd połączenia, spróbuj ponownie później", getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    if (rented != "bookNotExist") return redirectWithText(res, "Książka o takim numerze już istnieje", getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    const addBookValue = await addBook(title.replace(specialChars, ""), author.replace(specialChars, ""), publishingHouse.replace(specialChars, ""), ageCategory.replace(notNumbers, ""), type.replace(notNumbers, ""), shelf.replace(notNumbers, ""), localID.replace(notNumbers, ""))
    if (addBookValue == "dberr") return redirectWithText(res, "Błąd połączenia, spróbuj ponownie później", getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    redirectWithText(res, "Pomyślnie dodano książkę", getOldValue({ messagetype: "success" }), "addbook")
})

const addBook = (title, author, publishingHouse, ageCategory, type, shelf, localID) => {
    return new Promise(async (res) => {
        con.query(`INSERT INTO Books(Title, Author, PublishingHouse, AgeCategory, Type_ID, Shelves_ID, LocalID) VALUES ("${title}", "${author}", "${publishingHouse}", "${ageCategory}", ${type}, ${shelf}, ${localID});`, (err, rows, fields) => {
            if (err) return res("dberr");
            res(true)
        })
    })
}

module.exports = router;
