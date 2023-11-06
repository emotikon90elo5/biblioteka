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
    res.render("admin/bookList",{page:req.params.page, data: req.query})
})

router.get("/updateBook/:id", (req, res) => {
    res.render("admin/updateBook",{id:req.params.id, data: req.query})
})
router.get("/pupilList", (req, res) => {
    res.redirect("/admin/classlist")
})
router.get("/pupilList/:id", (req, res) => {
    res.render("admin/pupilList",{id:req.params.id, data: req.query})
})
router.get("/updatePupil/:pupilId", (req, res) => {
    res.render("admin/updatePupil",{pupilId:req.params.pupilId, data: req.query})
})
router.get("/classList", (req, res) => {
    res.render("admin/classList", {data: req.query})
})
router.get("/bookcaseList", (req, res) => {
    res.render("admin/bookcaseList", {data: req.query})
})
router.get("/updateShelf/:shelfId", (req, res) => {
    res.render("admin/updateShelf",{shelfId:req.params.shelfId, data: req.query})
})
router.get("/updateBookcase/:bookcaseId", (req, res) => {
    res.render("admin/updateBookcase",{bookcaseId:req.params.bookcaseId, data: req.query})
})
router.get("/booksReturn", (req, res) => {
    res.render("admin/booksReturn", { data: req.query})
})
router.get("/returnBook/:id", (req, res) => {
    res.render("admin/returnBook", {id:req.params.id, data: req.query})
})
module.exports = router;