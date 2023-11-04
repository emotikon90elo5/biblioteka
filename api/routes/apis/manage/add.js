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
    const { title, author, publishingHouse, ageCategory, type, shelf, localID } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    if (isRented(localID) != 'bookNotExist') return returnredirectWithText(res, 'Książka o podanym kodzie już istnieje', getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    const addBookValue = await addBook(title.replace(specialChars, ""), author.replace(specialChars, ""), publishingHouse.replace(specialChars, ""), Number(ageCategory.replace(notNumbers, "")), Number(type.replace(notNumbers, "")), Number(shelf.replace(notNumbers, "")), Number(localID.replace(notNumbers, "")))
    if (addBookValue != true) return redirectWithText(res, addBookValue, getOldValue(Object.assign(body, { messagetype: "err" })), "addbook");
    redirectWithText(res, "Pomyślnie dodano książkę", getOldValue({ messagetype: "success" }), "addbook")
})
router.post("/shelf", async ({ body }, res) => {
    const { name, bookcase } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "addshelf");
    const addShelfValue = await addShelf(name, bookcase.replace(notNumbers, ""))
    if (addShelfValue != true) return redirectWithText(res, addShelfValue, getOldValue(Object.assign(body, { messagetype: "err" })), "addshelf");
    redirectWithText(res, "Pomyślnie dodano połkę", getOldValue({ messagetype: "success" }), "addshelf")
})

router.post("/bookcase", async ({ body, session: { SchoolID } }, res) => {
    const { name } = body
    if (isNotUndifined({ name: name })) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "addbookcase");
    const addBookcaseValue = await addBookcase(name, SchoolID)
    if (addBookcaseValue != true) return redirectWithText(res, addBookcaseValue, getOldValue(Object.assign(body, { messagetype: "err" })), "addbookcase");
    redirectWithText(res, "Pomyślnie dodano szafkę", getOldValue({ messagetype: "success" }), "addbookcase")
})

router.post("/class", async ({ body, session: { SchoolID } }, res) => {
    const { name } = body
    if (isNotUndifined({ name: name })) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "addclass");
    const addClassValue = await addClass(name, SchoolID)
    if (addClassValue != true) return redirectWithText(res, addClassValue, getOldValue(Object.assign(body, { messagetype: "err" })), "addclass");
    redirectWithText(res, "Pomyślnie dodano klasę", getOldValue({ messagetype: "success" }), "addclass")
})

router.post("/pupil", async ({ body }, res) => {
    const { firstName, lastName, classID } = body
    if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "addpupil");
    const addPupilValue = await addPupil(firstName, lastName, classID.replace(notNumbers, ""))
    if (addPupilValue != true) return redirectWithText(res, addPupilValue, getOldValue(Object.assign(body, { messagetype: "err" })), "addpupil");
    redirectWithText(res, "Pomyślnie dodano ucznia", getOldValue({ messagetype: "success" }), "addpupil")
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

const addShelf = (name, bookcasesId) => {
    return new Promise(async (res) => {
        let shelf;
        try {
            shelf = await prisma.shelves.create({
                data: {
                    name: name,
                    bookcasesId: Number(bookcasesId)
                }
            })
        } catch (err) {
            return res(errHanler(err))
        }
        return res(true)
    })
}

const addBookcase = (name, schoolID) => {
    return new Promise(async (res) => {
        let bookcase;
        try {
            bookcase = await prisma.bookcases.create({
                data: {
                    name: name,
                    schoolsId: Number(schoolID)
                }
            })
        } catch (err) {
            return res(errHanler(err))
        }
        return res(true)
    })
}

const addClass = (name, schoolID) => {
    return new Promise(async (res) => {
        let clas;
        try {
            clas = await prisma.class.create({
                data: {
                    name: name,
                    schoolsId: Number(schoolID)
                }
            })
        } catch (err) {
            return res(errHanler(err))
        }
        return res(true)
    })
}

const addPupil = (firstName, lastName, classId) => {
    return new Promise(async (res) => {
        let clas;
        try {
            clas = await prisma.pupils.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    classId: Number(classId)
                }
            })
        } catch (err) {
            return res(errHanler(err))
        }
        return res(true)
    })
}


module.exports = router;
