const mysql = require("mysql")
require('dotenv').config();
let con = mysql.createConnection({
    host: process.env.MYSQLhost,
    user: process.env.MYSQLuser,
    password: process.env.MYSQLpassword,
    database: process.env.MYSQLdatabase
});
con.connect()


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

let isNotUndifined = (obj) => {
    let r = false;
    Object.entries(obj).forEach((v) => {
        if (typeof v[1] == "undefined" && v[1] == "") r = true
    })
    return r
}


const getPupilID = (firstName, lastName, classID) => {
    return new Promise((res) => {
        con.query(`SELECT Pupils.ID AS ID FROM Pupils WHERE Pupils.FirstName = "${firstName}" 
                                                AND Pupils.LastName = "${lastName}" 
                                                AND Pupils.Class_ID= "${classID}";`
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

exports.redirectWithText = redirectWithText
exports.getOldValue = getOldValue
exports.isNotUndifined = isNotUndifined
exports.isRented = isRented
exports.getPupilID = getPupilID
exports.getBookID = getBookID