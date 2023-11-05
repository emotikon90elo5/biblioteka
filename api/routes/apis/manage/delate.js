const express = require("express");
const router = express.Router();
const { isNotUndifined, redirectWithText, getOldValue, isRented } = require("./manager")
const { PrismaClient, Prisma } = require('@prisma/client');
const errHanler = require("../../errorHandler");
const prisma = new PrismaClient()

router.use(express.json())

const specialChars = /['"`]/g
const notNumbers = /\D/g

// router.delete("/book", async ({ body }, res) => {
//     const { name, bookcase } = body
//     if (isNotUndifined(body)) return res.json({ succes: false, message: "Bad request" });
//     const delateBookValue = await deletePupil(bookcase.replace(notNumbers, ""))
//     if (delateBookValue != true) return res.json({ succes: false, message: delateBookValue });
//     res.json({succes:true})
// })


// const deletePupil = (id) => {
//     return new Promise(async (res) => {
//         let clas;
//         try {
//             clas = await prisma.books.delete({
//                 where: {
//                     id: id
//                 }
//             })
//         } catch (err) {
//             return res(errHanler(err))
//         }
//         return res(true)
//     })
// }


module.exports = router;
