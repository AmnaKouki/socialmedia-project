const { PrismaClient } = require('@prisma/client')
const { prismaExclude } = require('prisma-exclude')

const prisma = new PrismaClient()
const exclude = prismaExclude(prisma)

module.exports = {
  prisma,
  exclude
}
