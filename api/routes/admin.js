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
    res.render("admin/addBook", req.query)
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
router.get("/book", (req, res) => {
    res.redirect("/admin/book/1")
})
router.get("/book/:page", (req, res) => {
    res.render("admin/bookList",{page:req.params.page})
})

router.get("/book/update/:id", (req, res) => {
    res.render("/admin/updatebook")
})
module.exports = router;