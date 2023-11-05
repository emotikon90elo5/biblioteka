const express = require("express");
const router = express.Router();
const { isNotUndifined, redirectWithText, getOldValue, isRented } = require("./manager")
const { PrismaClient, Prisma } = require('@prisma/client');
const errHanler = require("../../errorHandler");
const prisma = new PrismaClient()

router.use(express.json())

const specialChars = /['"`]/g
const notNumbers = /\D/g

router.delete("/book", async ({ body, session: { SchoolID } }, res) => {
    const { id } = body
    if (isNotUndifined(body)) return res.json({ succes: false, message: "Bad request" });
    const delateBookValue = await deleteBook(Number(id.replace(notNumbers, "")), SchoolID)
    if (delateBookValue != true) return res.json({ succes: false, message: delateBookValue });
    res.json({ succes: true })
})


const deleteBook = (id, schoolsId) => {
    return new Promise(async (res) => {
        try {
            await prisma.rents.deleteMany({
                where: {
                    booksId: id,
                    pupils: {
                        class: {
                            schoolsId: schoolsId
                        }
                    }
                },
            })
        } catch (err) {
            return res(errHanler(err))
        }

        try {
            await prisma.books.delete({
                where: {
                    id: id,
                    shelf: {
                        bookcase: {
                            schoolsId: schoolsId
                        }
                    }

                }
            })
        } catch (err) {
            return res(errHanler(err))
        }
        return res(true)
    })
}


module.exports = router;
