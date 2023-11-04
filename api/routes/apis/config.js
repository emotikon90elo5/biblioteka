const express = require("express");
const router = express.Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const errHanler = require("../errorHandler");
const prisma = new PrismaClient();
const notNumbers = /\D/g;

router.use(express.json());

router.get("/class", async ({ session: { SchoolID } }, res) => {
  let classList;
  try {
    classList = await prisma.class.findMany({
      where: {
        schoolsId: SchoolID,
      },
      select: {
        id:true,
        name:true,
        _count: {
          select: {
            pupils: true,
          },
        },
      },
    });
  } catch (err) {
    return res.json({ succes: false });
  }
  if (classList == null) return res.json({ succes: false });
  return res.json({ succes: true, data: classList });
});

router.get("/types", async ({}, res) => {
  let types;
  try {
    types = await prisma.type.findMany({});
  } catch (err) {
    return res.json({ succes: false });
  }
  if (types == null) return res.json({ succes: false });
  return res.json({ succes: true, data: types });
});

router.get("/shelf", async ({ session: { SchoolID } }, res) => {
  let shelf;
  try {
    shelf = await prisma.bookcases.findMany({
      where: {
        schoolsId: SchoolID,
      },
      include: {
        shelves: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (err) {
    return res.json({ succes: false });
  }
  if (shelf == null) return res.json({ succes: false });
  return res.json({ succes: true, data: shelf });
});
router.get("/bookcase", async ({ session: { SchoolID } }, res) => {
  let bookcases;
  try {
    bookcases = await prisma.bookcases.findMany({
      where: {
        schoolsId: SchoolID,
      },
    });
  } catch (err) {
    return res.json({ succes: false });
  }
  if (bookcases == null) return res.json({ succes: false });
  return res.json({ succes: true, data: bookcases });
});
router.get("/books", async ({ session: { SchoolID } }, res) => {
  let books;
  try {
    books = await prisma.books.findMany({
      where: {
        shelf: {
          bookcase: {
            schoolsId: SchoolID,
          },
        },
      },
    });
  } catch (err) {
    return res.json({ succes: false });
  }
  if (books == null) return res.json({ succes: false });
  res.json({
    succes: true,
    data: books,
  });
});

router.get("/pupils", async ({ session: { SchoolID } }, res) => {
  let pupils;
  try {
    pupils = await prisma.pupils.findMany({
      where: {
        class: {
          schoolsId: SchoolID,
        },
      },
      include: {
        class: true,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({ succes: false });
  }
  if (pupils == null) return res.json({ succes: false });
  return res.json({ succes: true, data: pupils });
});
router.get(
  "/pupils/:id",
  async ({ session: { SchoolID }, params: { id } }, res) => {
    let pupils;
    try {
      pupils = await prisma.pupils.findFirst({
        where: {
          id: Number(id.replace(notNumbers, "")),
          class: {
            schoolsId: SchoolID,
          },
        },
        include: {
          class: true,
        },
      });
    } catch (err) {
      console.log(err);
      return res.json({ succes: false });
    }
    if (pupils == null) return res.json({ succes: false });
    return res.json({ succes: true, data: pupils });
  }
);
router.get(
  "/classpupils/:id",
  async ({ session: { SchoolID }, params: { id } }, res) => {
    let pupils;
    try {
      pupils = await prisma.class.findFirst({
        where: {
          id: Number(id.replace(notNumbers, "")),
          schoolsId: SchoolID,
        },
        include: {
          pupils: true,
        },
      });
    } catch (err) {
      console.log(err);
      return res.json({ succes: false });
    }
    if (pupils == null) return res.json({ succes: false });
    return res.json({ succes: true, data: pupils });
  }
);
module.exports = router;
