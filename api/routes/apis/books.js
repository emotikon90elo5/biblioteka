const express = require("express");
const router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const errHanler = require("../errorHandler")
const prisma = new PrismaClient()

router.use(express.json());

const specialChars = /['"`]/g
const notNumbers = /\D/g

router.get("/Book/:id", async ({ params: { id } }, res) => {
  let book;
  try {
    book = await prisma.books.findFirst({
      where: {
        id: Number(id.replace(notNumbers, ""))
      }
    })
  }
  catch (err) {
    return res.json({ succes: false })
  }
  if (book == null) return res.json({ succes: false })
  res.json({ succes: true, data: book })
})

router.get("/Shelf/:id", async ({ params: { id } }, res) => {
  let shelf
  try {
    shelf = await prisma.shelves.findFirst({
      where: {
        id: Number(id.replace(notNumbers, ""))
      },
      include: {
        books: true
      }
    })
  }
  catch (err) {
    return res.json({ succes: false })
  }
  if (shelf == null) return res.json({ succes: false })
  res.json({ succes: true, data: shelf })
})
router.get("/Bookcase/:id", async ({ params: { id } }, res) => {
  let bookcases
  try {
    bookcases = await prisma.bookcases.findFirst({
      where: {
        id: Number(id.replace(notNumbers, ""))
      },
      include: {
        shelves: {
          include: {
            books: true
          }
        }
      }
    })
  }
  catch (err) {
    return res.json({ succes: false })
  }
  if (bookcases == null) return res.json({ succes: false })
  res.json({ succes: true, data: bookcases })
})
router.get("/School/:id", async ({ params: { id } }, res) => {
  let school
  try {
    school = await prisma.schools.findFirst({
      where: {
        id: id
      },
      include: {
        bookcases: {
          include: {
            shelves: {
              include: {
                books: true
              }
            }
          }
        }
      }
    })
  }
  catch (err) {
    return res.json({ succes: false })
  }
  if (school == null) return res.json({ succes: false })
  res.json({ succes: true, data: school })
})


// router.get("/find/School/:id", ({ params: { id }, query: { title, author, publishinghouse, agecategory } }, res) => {

//   con.query(`SELECT * FROM Books ` +
//     `INNER JOIN Shelves ON Shelves_ID = Shelves.ID ` +
//     `INNER JOIN Bookcases ON Bookcases.ID = Shelves.Bookcase_ID ` +
//     `WHERE Bookcases.School_ID="${id.replace(notNumbers, "")}" ` +
//     `AND Title LIKE "${title ? title.replace(specialChars, "") : ""}%" ` +
//     `AND Author LIKE "${author ? author.replace(specialChars, "") : ""}%" ` +
//     `AND PublishingHouse LIKE "${publishinghouse ? publishinghouse.replace(specialChars, "") : ""}%" ` +
//     `AND AgeCategory LIKE "${agecategory ? agecategory.replace(specialChars, "") : ""}%";`, (err, rows, fields) => {
//       if (err) throw err

//       res.json({ succes: true, data: rows })
//     })
// })
router.get("/find/School/:id", async ({ params: { id }, query: { title, author, publishinghouse, name } }, res) => {
  let school
  try {
    books = await prisma.books.findMany({
      where: {
        shelf:{
          bookcase:{
            schoolsId:Number(id.replace(notNumbers,""))
          }
        },
        title:{
          contains:title?title:"",
          
        },
        author:{
          contains:author?author:"",
        },
        publishingHouse:{
          contains:publishinghouse?publishinghouse:"",
        },
        type:{
          name:{
            contains:name?name:"",
          }
        }
      },
      include:{
        type:true
      }
    })
  }
  catch (err) {
    console.log(err)
    return res.json({ succes: false })
  }
  if (books == null) return res.json({ succes: false })
  res.json({ succes: true, data: books })
})

module.exports = router;