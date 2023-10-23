var express = require("express");
var router = express.Router();
require('dotenv').config();


router.get("/", (req, res) => {
    if(req.session.UserID==undefined) return res.render("auth/login", {error: ""})
    else return res.render("auth/logged");
})

module.exports = router;