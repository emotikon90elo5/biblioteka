const express = require("express");
const router = express.Router();
require('dotenv').config();

router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/rent", (req, res) => {
    res.render("admin/rent")
})

router.get("/addBook", (req, res) => {
    res.render("admin/addBook")
})

module.exports = router;