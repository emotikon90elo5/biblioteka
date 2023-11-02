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
    const user = await prisma.accounts.findFirstOrThrow({
        where: { Login: sha512(username) },
    })
    if (user==null) return res.redirect("/auth?error=Podałeś złe dane bądź konto nie istnieje");
    if (sha512.hmac("963852741pol" + user.ID + 1, password) == user.Pass) {
        req.session.UserID = user.ID;
        req.session.SchoolID = user.School_ID;
        req.session.save();
        res.redirect("/admin");
    } else {
        return res.redirect("/auth?error=Podałeś złe dane bądź konto nie istnieje2")
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/auth");
});

module.exports = router;
