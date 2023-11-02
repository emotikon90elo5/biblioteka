const express = require("express");
const router = express.Router();
require('dotenv').config();

router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/rent", (req, res) => {
    res.render("admin/rent", req.query)
})

router.get("/addBook", (req, res) => {
    res.render("admin/addBook")
})
router.get("/addShelf", (req, res) => {
    res.render("admin/addShelf")
})
router.get("/addBookCase", (req, res) => {
    res.render("admin/addBookCase")
})
router.get("/addClass", (req, res) => {
    res.render("admin/addClass")
})
router.get("/updateBook", (req, res) => {
    res.render("admin/updateBook")
})
module.exports = router;