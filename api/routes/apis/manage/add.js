const express = require("express");
const router = express.Router();
const { isNotUndifined, redirectWithText, getOldValue, isRented } = require("./manager")
const { PrismaClient, Prisma } = require('@prisma/client');
const errHanler = require("../../errorHandler");
const prisma = new PrismaClient()

router.use(express.json())

const specialChars = /['"`]/g
const notNumbers = /\D/g

router.post("/book", async ({ session: { SchoolID }, body }, res) => {
    const { title, author, publishingHouse, ageCategory, type, shelf, localID } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    const addBookValue = await addBook(title.replace(specialChars, ""), author.replace(specialChars, ""), publishingHouse.replace(specialChars, ""), Number(ageCategory.replace(notNumbers, "")), Number(type.replace(notNumbers, "")), Number(shelf.replace(notNumbers, "")), Number(localID.replace(notNumbers, "")))
    if (addBookValue != true) return redirectWithText(res, addBookValue, getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    redirectWithText(res, "Pomyślnie dodano książkę", getOldValue({ messagetype: "success" }), "addbook")
})

const addBook = (title, author, publishingHouse, ageCategory, type, shelf, localID) => {
    return new Promise(async (res) => {
        let book;
        try {
            book = await prisma.books.create({
                data: {
                    title: title,
                    author: author,
                    publishingHouse: publishingHouse,
                    ageCategory: ageCategory,
                    typeid: type,
                    shelvesId: shelf,
                    localid: localID

                }
            })
        } catch (err) {
            return res(errHanler(err))
        }
        return res(true)
    })
}

module.exports = router;
