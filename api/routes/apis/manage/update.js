const express = require("express");
const router = express.Router();
const { isNotUndifined, redirectWithText, getOldValue, isRented } = require("./manager")
const { PrismaClient, Prisma } = require('@prisma/client');
const errHanler = require("../../errorHandler");
const prisma = new PrismaClient()

router.use(express.json())

const specialChars = /['"`]/g
const notNumbers = /\D/g

router.post("/book", async ({ body }, res) => {
    const { title, author, publishingHouse, ageCategory, type, shelf, localID, id } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "updatebook/"+id);
    const updateBookValue = await updateBook(title.replace(specialChars, ""), author.replace(specialChars, ""), publishingHouse.replace(specialChars, ""), Number(ageCategory.replace(notNumbers, "")), Number(type.replace(notNumbers, "")), Number(shelf.replace(notNumbers, "")), Number(localID.replace(notNumbers, "")), Number(id.replace(notNumbers, "")))
    if (updateBookValue != true) return redirectWithText(res, updateBookValue, getOldValue(Object.assign(body, { messagetype: "err" })), "updatebook/"+id);
    redirectWithText(res, "Pomyślnie dodano książkę", getOldValue({ messagetype: "success" }), "updatebook/"+id)
})

const updateBook = (title, author, publishingHouse, ageCategory, type, shelf, localID, id) => {
    return new Promise(async (res) => {
        let book;
        try {
            book = await prisma.books.update({
                data: {
                    title: title,
                    author: author,
                    publishingHouse: publishingHouse,
                    ageCategory: ageCategory,
                    typeid: type,
                    shelvesId: shelf,
                    localid: localID
                },
                where: {
                    id: id
                }
            })
        } catch (err) {
            return res(errHanler(err))
        }
        return res(true)
    })
}

module.exports = router;