const express = require("express");
const router = express.Router();
const sha512 = require("js-sha512").sha512;
const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient()

router.use(express.json());


router.get("/lastdays", async ({ }, res) => {
    let now = new Date()
    let re = [], thismon, lastmon
    thismon2 = []
    lastmon2 = []
    now.setDate(now.getDate() - 13)
    let rents;
    console.log(`SELECT COUNT(id) FROM Rents WHERE cast(rentTime as DATETIME) < ${now.getFullYear() + "-" + (now.getMonth() + 2) + "-01"} AND cast(rentTime as DATETIME) >= ${now.getFullYear() + "-" + (now.getMonth() + 1) + "-01"}`);
    try {
        rents = await prisma.$queryRaw`SELECT COUNT(id), DAY(Rents.rentTime) FROM Rents WHERE cast(rentTime as DATETIME) >= ${now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()} GROUP BY DAY(Rents.rentTime);`;
        thismon = await prisma.$queryRaw`SELECT COUNT(id) FROM Rents WHERE cast(rentTime as DATETIME) < ${now.getFullYear() + "-" + (now.getMonth() + 3) + "-01"} AND cast(rentTime as DATETIME) >= ${now.getFullYear() + "-" + (now.getMonth() + 2) + "-01"}`;
        lastmon = await prisma.$queryRaw`SELECT COUNT(id) FROM Rents WHERE cast(rentTime as DATETIME) < ${now.getFullYear() + "-" + (now.getMonth() + 2) + "-01"} AND cast(rentTime as DATETIME) >= ${now.getFullYear() + "-" + (now.getMonth() + 1) + "-01"}`;
    } catch (err) {
        console.log(err)
        return res.json({ succes: false });
    }
    rents.forEach(element => {
        re.push({
            count: Number(String(element['COUNT(id)'])),
            day: element['DAY(Rents.rentTime)']
        })
    });
    thismon.forEach(element => {
        thismon2.push({ count: Number(String(element['COUNT(id)'])) })
    });
    lastmon.forEach(element => {
        lastmon2.push({ count: Number(String(element['COUNT(id)'])) })
    });
    if (rents == null) return res.json({ succes: false });
    return res.json({ succes: true, data: re, thismon: thismon2, lastmon: lastmon2 });
});

module.exports = router;
