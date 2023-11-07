const express = require("express");
const router = express.Router();
const addRouter = require("./manage/add")
const updateRouter = require("./manage/update")
const deleteRouter = require("./manage/delete")
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

router.post("/unrent", (req, res, next) => {
  if (!req.session.SchoolID) return res.json({ succes: false, auth: false })
  next()
}, async ({ session: { SchoolID }, body }, res) => {
  const { bookcase, id} = body;
  let message="Błąd";

  if (isNotUndifined(body)) return redirectWithText(res, 'Nie podałeś pełnych danych', getOldValue(Object.assign({ messagetype: "err" })), "returnBook/"+id);

  let unrentValue = await unrent(id.replace(notNumbers, ""), Number(bookcase.replace(specialChars, "")), SchoolID)

  switch (unrentValue) {
    case "dberr":
      message = "Błąd połączenia, spróbuj ponownie później";
      break;
  }
  if (unrentValue != true) return redirectWithText(res, message, getOldValue(Object.assign({ messagetype: "err" })), "returnBook/"+id);

  return redirectWithText(res, 'Pomyślnie Oddano', getOldValue({ messagetype: "success" }), "booksreturn");
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

const unrent = async (id, shelfID, schoolId)=>{
  return new Promise(async (res) => {
    let unrent = null;
    let book = null;
    try {
      unrent = await prisma.rents.updateMany({
        where:{
          booksId:Number(id),
          rented: true,
          pupils:{
            class:{
              schoolsId: schoolId
            }
          }
        }, 
        data:{
          rented: false,
        }
      });
      book = await prisma.books.updateMany({
        where:{
         id:Number(id)
        }, 
        data:{
          shelvesId: Number(shelfID)
        }
      })
    } catch (err) {
      console.log(err)
      return res("dberr")
    }
    if (unrent != null && book != null) res(true)
    else res("dberr")
  })
}

exports.router = router