var express = require("express");
var router = express.Router();
var BooksRouter = require("./apis/books")
var AuthRouter = require("./apis/auth")
var ConfigRouter = require("./apis/config")
var ManageRouter = require("./apis/manage")
var HomePageRouter = require("./apis/homepage")
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

require('dotenv').config();

router.use("/books", BooksRouter);
router.use("/auth", AuthRouter);
router.use("/config", (req, res, next)=>{
  if(!req.session.SchoolID) return res.json({succes: false})
  next()
}, ConfigRouter);
router.use("/manage", ManageRouter.router);
router.use("/homepage", HomePageRouter);

router.get("/school", async ({}, res) => {
  let Schools;
  try {
    Schools = await prisma.Schools.findMany({
      
    });
  } catch (err) {

    return res.json({ succes: false });
  }
  if (Schools == null) return res.json({ succes: false });
  return res.json({ succes: true, data: Schools });
});
router.get("/books/:id", async ({params: { id }}, res) => {
  let Schools;
  try {
    Schools = await prisma.Schools.findMany({
      
    });
  } catch (err) {

    return res.json({ succes: false });
  }
  if (Schools == null) return res.json({ succes: false });
  return res.json({ succes: true, data: Schools });
});
router.all("*", (req, res) => {
  res.statusCode = 404
  res.json({ succes: false, data: "Not found" })
})

module.exports = router;