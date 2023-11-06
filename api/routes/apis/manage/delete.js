const express = require("express");
const router = express.Router();
const { isNotUndifined, redirectWithText, getOldValue, isRented } = require("./manager")
const { PrismaClient, Prisma } = require('@prisma/client');
const errHanler = require("../../errorHandler");
const { PrismaClientKnownRequestError } = require("@prisma/client/runtime/library");
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

router.delete("/shelf", async ({ body, session: { SchoolID } }, res) => {
    const { id } = body
    if (isNotUndifined(body)) return res.json({ succes: false, message: "Bad request" });
    const delateShelfValue = await deleteShelf(Number(id.replace(notNumbers, "")), SchoolID)
    if (delateShelfValue != true) return res.json({ succes: false, message: delateShelfValue });
    res.json({ succes: true })
})

router.delete("/bookcase", async ({ body, session: { SchoolID } }, res) => {
    const { id } = body
    if (isNotUndifined(body)) return res.json({ succes: false, message: "Bad request" });
    const deleteBookcaseValue = await deleteBookcase(Number(id.replace(notNumbers, "")), SchoolID)
    if (deleteBookcaseValue != true) return res.json({ succes: false, message: deleteBookcaseValue });
    res.json({ succes: true })
})

router.delete("/pupil", async ({ body, session: { SchoolID } }, res) => {
    const { id } = body
    if (isNotUndifined(body)) return res.json({ succes: false, message: "Bad request" });
    const deletePupilValue = await deletePupil(Number(id.replace(notNumbers, "")), SchoolID)
    if (deletePupilValue != true) return res.json({ succes: false, message: deletePupilValue });
    res.json({ succes: true })
})

router.delete("/class", async ({ body, session: { SchoolID } }, res) => {
    const { id } = body
    if (isNotUndifined(body)) return res.json({ succes: false, message: "Bad request" });
    const deleteClassValue = await deleteClass(Number(id.replace(notNumbers, "")), SchoolID)
    if (deleteClassValue != true) return res.json({ succes: false, message: deleteClassValue });
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

const deleteShelf = (id, schoolsId) => {
    return new Promise(async (res) => {
        try {
            await prisma.shelves.delete({
                where: {
                    id: id,
                    bookcase: {
                        schoolsId: schoolsId
                    }
                },
            })
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code == 'P2003' && err.meta.field_name == 'shelvesId') {
                    return res("Nie możesz usunąć półki na której są książki!")
                }
            }
            return res(errHanler(err))
        }
        return res(true)
    })
}

const deleteBookcase = (id, schoolsId) => {
    return new Promise(async (res) => {
        try {
            await prisma.bookcases.delete({
                where: {
                    id: id,
                    schoolsId: schoolsId
                },
            })
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code == 'P2003' && err.meta.field_name == 'bookcasesId') {
                    return res("Nie możesz usunąć szfki w której są półki!")
                }
            }
            return res(errHanler(err))
        }
        return res(true)
    })
}

const deletePupil = (id, schoolsId) => {
    return new Promise(async (res) => {
        try {
            await prisma.rents.deleteMany({
                where: {
                    pupils: {
                        id: id,
                        class: {
                            schoolsId: schoolsId
                        }
                    }
                },
            })
            await prisma.pupils.delete({
                where: {
                    id: id,
                    class: {
                        schoolsId: schoolsId
                    }
                },
            })
        } catch (err) {
            return res(errHanler(err))
        }
        return res(true)
    })
}

const deleteClass = (id, schoolsId) => {
    return new Promise(async (res) => {
        try {
            await prisma.class.delete({
                where: {
                    id: id,
                    schoolsId: schoolsId
                },
            })
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code == 'P2003' && err.meta.field_name == 'classId') {
                    return res("Nie możesz usunąć klasy w której są uczniowie!")
                }
            }
            return res(errHanler(err))
        }
        return res(true)
    })
}

module.exports = router;
