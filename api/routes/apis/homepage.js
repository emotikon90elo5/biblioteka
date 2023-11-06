const express = require("express");
const router = express.Router();
const sha512 = require("js-sha512").sha512;
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient()

router.use(express.json());


router.get("/lastdays", async ({ }, res) => {
    let now = new Date()
    let re = []
    now.setDate(now.getDate()-13)
    let rents;
    try {
        rents = await prisma.$queryRaw`SELECT COUNT(id), DAY(Rents.rentTime) FROM Rents WHERE cast(rentTime as DATETIME) >= ${now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()} GROUP BY DAY(Rents.rentTime);`;
    } catch (err) {
        console.log(err)
        return res.json({ succes: false });
    }
    rents.forEach(element => {
        re.push( {count: Number(String(element['COUNT(id)'])),
        day: element['DAY(Rents.rentTime)']})
    });
    if (rents == null) return res.json({ succes: false });
    return res.json({ succes: true, data: re });
});

module.exports = router;
