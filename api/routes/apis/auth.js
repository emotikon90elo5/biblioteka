const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const sha512 = require("js-sha512").sha512;
require("dotenv").config();

const con = mysql.createConnection({
    host: process.env.MYSQLhost,
    user: process.env.MYSQLuser,
    password: process.env.MYSQLpassword,
    database: process.env.MYSQLdatabase,
});

con.connect();

router.use(express.json());

router.post("/login", (req, res) => {
    const { password, username } = req.body
    if(req.session.UserID) return res.redirect("/admin");
    if (!username || !password) {
        return res.redirect("/auth?error=Nie podałeś nazwy użytkownika i/lub hasła");
    }
    con.query(`SELECT * FROM Accounts WHERE Login = "${sha512(username)}"`, (err, rows, fields) => {
        if (err) throw err;
        if (!rows[0]) return res.redirect("/auth?error=Podałeś złe dane bądź konto nie istnieje");
        if (sha512.hmac("963852741pol" + rows[0].ID + 1, password) == rows[0].Pass) {
            req.session.UserID = rows[0].ID;
            req.session.SchoolID = rows[0].School_ID;
            req.session.save();
            res.redirect("/admin");
        } else {
            return res.redirect("/auth?error=Podałeś złe dane bądź konto nie istnieje")
        }
    }
    );
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/auth");
});

module.exports = router;
