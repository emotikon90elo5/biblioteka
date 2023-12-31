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
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "updatebook/" + id);
    const updateBookValue = await updateBook(title.replace(specialChars, ""), author.replace(specialChars, ""), publishingHouse.replace(specialChars, ""), Number(ageCategory.replace(notNumbers, "")), Number(type.replace(notNumbers, "")), Number(shelf.replace(notNumbers, "")), Number(localID.replace(notNumbers, "")), Number(id.replace(notNumbers, "")))
    if (updateBookValue != true) return redirectWithText(res, updateBookValue, getOldValue(Object.assign(body, { messagetype: "err" })), "updatebook/" + id);
    redirectWithText(res, "Pomyślnie zmieniono książkę", getOldValue({ messagetype: "success" }), "updatebook/" + id)
})
router.post("/shelf", async ({ body }, res) => {
    const { name, id } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "updateshelf/" + id);
    const updateShelfValue = await updateShelf(name, Number(id.replace(notNumbers, "")))
    if (updateShelfValue != true) return redirectWithText(res, updateShelfValue, getOldValue(Object.assign(body, { messagetype: "err" })), "updateshelf/" + id);
    redirectWithText(res, "Pomyślnie zmieniono półkę", getOldValue({ messagetype: "success" }), "updateshelf/" + id)
})
router.post("/bookcase", async ({ body }, res) => {
    const { name, id } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "updatebookcase/" + id);
    const updateBookcaseValue = await updateBookcase(name, Number(id.replace(notNumbers, "")))
    if (updateBookcaseValue != true) return redirectWithText(res, updateBookcaseValue, getOldValue(Object.assign(body, { messagetype: "err" })), "updatebookcase/" + id);
    redirectWithText(res, "Pomyślnie zmieniono szafkę", getOldValue({ messagetype: "success" }), "updatebookcase/" + id)
})
router.post("/class", async ({ body }, res) => {
    const { name, id } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "pupillist/" + id);
    const updateClassValue = await updateClass(name, Number(id.replace(notNumbers, "")))
    if (updateClassValue != true) return redirectWithText(res, updateClassValue, getOldValue(Object.assign(body, { messagetype: "err" })), "pupillist/" + id);
    redirectWithText(res, "Pomyślnie zmieniono klasę", getOldValue({ messagetype: "success" }), "pupillist/" + id)
})
router.post("/pupil", async ({ body }, res) => {
    const { firstName, lastName, classID, id } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "updatepupil/" + id);
    const updatePupilValue = await updatePupil(firstName, lastName, Number(classID.replace(notNumbers, "")), Number(id.replace(notNumbers, "")))
    if (updatePupilValue != true) return redirectWithText(res, updatePupilValue, getOldValue(Object.assign(body, { messagetype: "err" })), "updatepupil/" + id);
    redirectWithText(res, "Pomyślnie zmieniono klasę", getOldValue({ messagetype: "success" }), "updatepupil/" + id)
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

const updateShelf = (name, id) => {
    return new Promise(async (res) => {
        let shelf;
        try {
            shelf = await prisma.shelves.update({
                data: {
                    name: name
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

const updateBookcase = (name, id) => {
    return new Promise(async (res) => {
        let bookcase;
        try {
            bookcase = await prisma.bookcases.update({
                data: {
                    name: name
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

const updateClass = (name, id) => {
    return new Promise(async (res) => {
        let classes;
        try {
            classes = await prisma.class.update({
                data: {
                    name: name
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

const updatePupil = (firstName, lastname, classId , id) => {
    return new Promise(async (res) => {
        let pupil;
        try {
            pupil = await prisma.pupils.update({
                data: {
                    firstName: firstName,
                    lastName: lastname,
                    classId: classId
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
