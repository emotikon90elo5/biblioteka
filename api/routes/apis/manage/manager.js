const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

const specialChars = /['"`]/g
const notNumbers = /\D/g

const isRented = (localID, schoolID) => {
    return new Promise(async (res) => {
        let renteds;
        try {
            renteds = await prisma.books.findFirst({
                where: {
                    shelf: {
                        bookcase: {
                            schoolsId: schoolID
                        }
                    },
                    localid: Number(localID.replace(notNumbers, ""))
                },
                include: {
                    rents: {
                        select: {
                            rented: true
                        }
                    }
                }
            })
        } catch (err) {
            return res("dberr")
        }
        if (renteds == null) return res("bookNotExist")
        renteds.rents.forEach(element => {
            if (element.rented == 1) return res(true)
        });
        res(false)

    })
}

let isNotUndifined = (obj) => {
    let r = false;
    Object.entries(obj).forEach((v) => {
        if (typeof v[1] == "undefined" || v[1] == "") r = true
    })
    return r
}


const getPupilID = (firstName, lastName, classID) => {
    let pupil;
    return new Promise(async (res) => {
        try {
            pupil = await prisma.pupils.findFirst({
                where: {
                    firstName: firstName,
                    lastName: lastName,
                    classId: Number(classID.replace(notNumbers, ""))
                }
            })
        } catch (err) {
            console.log(err)
            return res("dberr")
        }
        if (pupil == null) return res("pupilNotExist")
        res(pupil.id)
    })
}

const getBookID = (schoolID, localID) => {
    return new Promise(async (res) => {
        let book;
        try {
            book = await prisma.books.findFirst({
                where: {
                    shelf: {
                        bookcase: {
                            schoolsId: schoolID
                        }
                    },
                    localid: Number(localID.replace(notNumbers, ""))
                }
            })
        } catch (err) {
            console.log(err)
            return res("dberr")
        }
        if (book == null) return res("bookNotExist")
        res(book.id)

    })
}

const getOldValue = (values) => {
    let str = "";
    Object.entries(values).forEach((v) => {
        if (typeof v[1] != "undefined" && v[1] != "") str += "&" + v[0] + "=" + v[1]
    })
    return str;
}

const redirectWithText = (res, message, args, subpage) => {
    res.redirect(`/admin/${subpage}?message=` + message + args);
}

exports.redirectWithText = redirectWithText
exports.getOldValue = getOldValue
exports.isNotUndifined = isNotUndifined
exports.isRented = isRented
exports.getPupilID = getPupilID
exports.getBookID = getBookID