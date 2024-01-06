const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { faker } = require('@faker-js/faker')
const slug = require('slug')
const bcrypt = require('bcrypt')

async function main() {
  const amountOfUsers = 50
  const users = []

  for (let i = 0; i < amountOfUsers; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    const randomGender = () => {
      // Male or Female
      let gender = ['MALE', 'FEMALE']
      let randomIndex = Math.floor(Math.random() * gender.length)
      return gender[randomIndex]
    }

    const user = {
      bgImage: faker.image.url(),
      avatar: faker.image.avatar(),
      firstName,
      lastName,
      email: faker.internet.email({
        firstName,
        lastName
      }),
      password: bcrypt.hashSync('123456', 12),
      connected: false,
      userFunction: faker.person.jobTitle(),
      description: faker.lorem.sentence(),
      address: faker.location.streetAddress(),
      gender: randomGender(),
      country: faker.location.country(),
      phone: faker.phone.number(),
      url: slug(`${firstName} ${lastName}`),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    }

    users.push(user)
  }

  const addUsers = async () => await prisma.user.createMany({ data: users })

  addUsers()
}

main().finally(async () => {
  await prisma.$disconnect()
})
