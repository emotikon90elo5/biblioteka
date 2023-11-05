const express = require("express");
const router = express.Router();
const addRouter = require("./manage/add")
const updateRouter = require("./manage/update")
const deleteRouter = require("./manage/delate")
const { isNotUndifined, redirectWithText, getOldValue, getPupilID, getBookID, isRented } = require("./manage/manager")
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient()

const specialChars = /['"`]/g
const notNumbers = /\D/g


router.use(express.json());
router.use("/add", (req, res, next) => {
  if (!req.session.SchoolID) return res.redirect('/auth')
  next()
}, addRouter)

router.use("/update", (req, res, next) => {
  if (!req.session.SchoolID) return res.redirect('/auth')
  next()
}, updateRouter)

router.use("/delete", (req, res, next) => {
  if (!req.session.SchoolID) return res.json({ succes: false, auth: false })
  next()
}, deleteRouter)


router.post("/rent", (req, res, next) => {
  if (!req.session.SchoolID) return res.json({ succes: false, auth: false })
  next()
}, async ({ session: { SchoolID }, body }, res) => {
  const { localID, firstname, lastname, classID } = body;
  let message;

  if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign(body, { messagetype: "err" })), "rent");

  let rented = await isRented(localID.replace(notNumbers, ""), SchoolID)

  switch (rented) {
    case "dberr":
      message = "Błąd połączenia, spróbuj ponownie później";
      break;
    case "bookNotExist":
      message = "Taki numer książki nie istnieje"
      break;
    case true:
      message = "Ta książka jest już wyporzyczona"
      break;
  }
  if (rented != false) return redirectWithText(res, message, getOldValue(Object.assign(body, { messagetype: "err" })), "rent");

  let rentValue = await rent(localID.replace(notNumbers, ""), firstname.replace(specialChars, ""), lastname.replace(specialChars, ""), classID.replace(notNumbers, ""), SchoolID)

  switch (rentValue) {
    case "dberr":
      message = "Błąd połączenia, spróbuj ponownie później";
      break;
    case "bookNotExist":
      message = "Taki numer książki nie istnieje"
      break;
    case "pupilNotExist":
      message = "Taki uczeń nie istnieje"
      break;
  }
  if (rentValue != true) return redirectWithText(res, message, getOldValue(Object.assign(body, { messagetype: "err" })), "rent");

  return redirectWithText(res, 'Pomyślnie wyporzyczono', getOldValue({ messagetype: "success" }), "rent");
})

//rent
const rent = async (localID, firstName, lastName, classID, schoolID) => {
  return new Promise(async (res) => {
    let create = null;
    let pupilsId = await getPupilID(firstName, lastName, classID)
    let booksId = await getBookID(schoolID, localID)
    if (pupilsId == "dberr" || pupilsId == "pupilNotExist") return res(pupilsId)
    if (booksId == "dberr" || booksId == "bookNotExist") return res(booksId)
    try {
      create = await prisma.rents.create({ data: { pupilsId, booksId } });
    } catch (err) {
      return res("dberr")
    }
    if (create != null) res(true)
    else res("dberr")
  })
}

exports.router = router