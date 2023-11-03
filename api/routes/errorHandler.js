const { Prisma } = require("@prisma/client")

const errHanler = (err) => {

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return "Nie możesz tego stworzyć gdyż już istnieje przedmiot o tym samym identyfikatorze!"
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
        console.log(err.code)
        return "Podałeś niepoprawne dane"
        
    }
}
module.exports = errHanler