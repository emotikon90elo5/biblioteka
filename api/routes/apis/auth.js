var express = require("express");
var router = express.Router();
var mysql = require("mysql")
var sha512 = require('js-sha512').sha512;
require('dotenv').config();

var con = mysql.createConnection({
    host: process.env.MYSQLhost,
    user: process.env.MYSQLuser,
    password: process.env.MYSQLpassword,
    database: process.env.MYSQLdatabase
});

con.connect()

router.use(express.json());

router.post("/login", (req, res) => {
    if (req.body.username == undefined && req.body.password == undefined) {
        return res.render("auth/login", {error: "Nie podałeś nazwy użytkownika i hasła"})
    }else if(req.body.username == undefined){
        return res.render("auth/login", {error: "Nie podałeś nazwy użytkownika"})
    }else if(req.body.password == undefined){
        return res.render("auth/login", {error: "Nie podałeś hasła"})
    }
    con.query(`SELECT * FROM Accounts WHERE Login = "${sha512(req.body.username)}"`, (err, rows, fields) => {
        if (err) throw err
        console.log(sha512.hmac('963852741pol' + rows[0].ID + 1, req.body.password))
        if (sha512.hmac('963852741pol' + rows[0].ID + 1, req.body.password) == rows[0].Pass) {

            req.session.UserID = rows[0].ID
            req.session.SchoolID = rows[0].School_ID
            req.session.save()
            res.redirect("/")
        } else {
            return res.render("auth/login", {error: "Podałeś złe dane bądź konto nie istnieje"})
        }

    })
})

router.get("/logout", (req, res)=>{
    req.session.destroy();
    res.redirect("/auth")
})

module.exports = router;