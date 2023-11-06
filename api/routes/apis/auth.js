const express = require("express");
const router = express.Router();
const sha512 = require("js-sha512").sha512;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

router.use(express.json());

router.post("/login", async (req, res) => {
    const { password, username } = req.body
    if (req.session.UserID) return res.redirect("/admin");
    if (!username || !password) {
        return res.redirect("/auth?error=Nie podałeś nazwy użytkownika i/lub hasła");
    }
    let user
    try {
        user = await prisma.accounts.findFirstOrThrow({
            where: { login: sha512(username) },
        })
    } catch (err) {

    }
    if (user == null) return res.redirect("/auth?error=Podałeś złe dane bądź konto nie istnieje");
    if (sha512.hmac("963852741pol" + user.id + 1, password) == user.pass) {
        req.session.UserID = user.id;
        req.session.SchoolID = user.schoolsId;
        req.session.save();
        res.redirect("/admin");
    } else {
        return res.redirect("/auth?error=Podałeś złe dane bądź konto nie istnieje")
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/auth");
});

module.exports = router;
