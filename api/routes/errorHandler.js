const { Prisma } = require("@prisma/client")

const errHanler = (err) => {

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return "Podałeś niepoprawne dane"
    }
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        return "Błąd połączenia, spróbuj ponownie później"
    }
    if (err instanceof Prisma.PrismaClientRustPanicError) {
        return "Błąd połączenia, spróbuj ponownie później"
    }
    if (err instanceof Prisma.PrismaClientInitializationError) {
        return "Błąd połączenia, spróbuj ponownie później"
    }
    if (err instanceof Prisma.PrismaClientValidationError) {
        return "Podałeś niepoprawne dane"

    }
}
module.exports = errHanler