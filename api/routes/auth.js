const express = require("express");
const router = express.Router();
require('dotenv').config();

router.get("/", ({ session, query }, res) => {
    if (!session.UserID) return res.render("auth/login", { data: query })
    return res.redirect("/admin");
})

module.exports = router;