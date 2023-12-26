const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


(async function main() {
  try {
    const user = await prisma.user.upsert({
        where: {
            id: 1
        },
        create: {
            firstName: "Foulen",
            lastName: "Fouleni",
            birthday: new Date("01-01-2019"),
            email: "test@test.com",
            password: "123456789",
            address: "Tunis",
            avatar: "test.jpg",
            bgImage: "test2.jpg",
            connected: true,
            country: "Tunisia",
            description: "BIO",
            phone: "00000000",
            url: "user1",
            userFunction: "JOB",
            
        },
        update: {},
    })

    console.log("Create 1 user", user);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
