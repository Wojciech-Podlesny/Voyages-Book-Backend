import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

export default prisma;


//przerobic na singleton//

/*

import ...
declare global {
    var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClien()

if(process.env.NODE_ENV !== "production") global.prisma = prisma

export default prisma

*/