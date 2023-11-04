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
    res.render("admin/addShelf", req.query)
})
router.get("/addBookCase", (req, res) => {
    res.render("admin/addBookCase", req.query)
})
router.get("/addClass", (req, res) => {
    res.render("admin/addClass", req.query)
})

router.get("/addPupil", (req, res) => {
    res.render("admin/addPupil", req.query)
})

router.get("/book", (req, res) => {
    res.redirect("/admin/book/1")
})
router.get("/book/:page", (req, res) => {
    res.render("admin/bookList",{page:req.params.page})
})

router.get("/book/update/:id", (req, res) => {
    res.render("admin/updateBook",{page:req.params.id})
})
router.get("/pupilList", (req, res) => {
    res.redirect("/admin/pupilList/1")
})
router.get("/pupilList/:id", (req, res) => {
    res.render("admin/pupilList",{id:req.params.id})
})
router.get("/updatePupil/:pupilId", (req, res) => {
    res.render("admin/updatePupil",{pupilId:req.params.pupilId})
})
router.get("/classList", (req, res) => {
    res.render("admin/classList")
})
router.get("/shelfList", (req, res) => {
    res.render("admin/shelfList")
})
module.exports = router;