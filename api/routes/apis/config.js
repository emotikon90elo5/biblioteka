const express = require("express");
const router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const errHanler = require("../errorHandler")
const prisma = new PrismaClient()

router.use(express.json());

router.get("/class", async ({ session: { SchoolID } }, res) => {
  let classList;
  try {
    classList = await prisma.class.findMany({
      where: {
        schoolsId: SchoolID
      }
    })
  } catch (err) {
    return  res.json({ succes: false })
  }
  if (classList == null) return res.json({ succes: false })
  return res.json({ succes: true, data: classList })
})

router.get("/types", async ({ }, res) => {
  let types;
  try {
    types = await prisma.type.findMany({})
  } catch (err) {
    return res.json({ succes: false })
  }
  if (types == null) return res.json({ succes: false })
  return res.json({ succes: true, data: types })
})

router.get("/shelf", async ({ session: { SchoolID } }, res) => {
  let shelf;
  try {
    shelf = await prisma.bookcases.findMany({
      where: {
        schoolsId: SchoolID
      },
      include: {
        shelves: {
          select:{
            name: true
          }
        }
      }
    })
  } catch (err) {
    return res.json({ succes: false })
  }
  if (shelf == null) return res.json({ succes: false })
  return res.json({ succes: true, data: shelf })
})
router.get("/bookcase", async ({ session: { SchoolID } }, res) => {

  let bookcases;
  try {
    bookcases = await prisma.class.findMany({
      where: {
        schoolsId: SchoolID
      }
    })
  } catch (err) {
    return  res.json({ succes: false })
  }
  if (bookcases == null) return res.json({ succes: false })
  return res.json({ succes: true, data: bookcases })

})
router.get("/books", async ({ session: { SchoolID } }, res) => {
  let school
  try {
    school = await prisma.schools.findFirst({
      where: {
        id: SchoolID
      },
      include: {
        bookcases: {
          include: {
            shelves: {
              include: {
                books: true
              }
            }
          }
        }
      }
    })
  }
  catch (err) {
    return res.json({ succes: false })
  }
  if (school == null) return res.json({ succes: false })
  res.json({ succes: true, data: school })
})
module.exports = router;