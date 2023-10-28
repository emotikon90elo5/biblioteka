const express = require("express");
const router = express.Router();
require('dotenv').config();

router.get("/", (req, res) => {
    if(!req.session.UserID) return res.render("auth/login", {error: ""})
    return res.redirect("/admin");
})

module.exports = router;