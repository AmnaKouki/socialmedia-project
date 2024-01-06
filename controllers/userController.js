const { exclude, prisma } = require('../utils/prisma')
const dayjs = require('dayjs')
/**
 * Create a new user
 * @param {*} req
 * @param {*} res
 */
const createUser = async (req, res) => {
  try {
    // testing the creation of a user
    //to change later
    const user = await prisma.user.create({
      data: {
        firstName: 'Foulen 2',
        lastName: 'Fouleni 2',
        birthday: new Date('01-01-2019'),
        email: 'test2@test.com',
        password: '123456789',
        address: 'Tunis',
        avatar: 'test.jpg',
        bgImage: 'test2.jpg',
        connected: true,
        country: 'Tunisia',
        description: 'BIO',
        phone: '00000000',
        url: 'user1',
        userFunction: 'JOB'
      }
    })

    res.send('User Created successfully')
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).send('Error while creating user')
    // TODO:  redirect to an error page
  }
}

const updateUser = async (req, res) => {
  // update user data
  let user = res.locals.user
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthday: dayjs(req.body.birthday).toISOString(),
        email: req.body.email,
        address: req.body.address,
        country: req.body.country,
        description: req.body.description,
        phone: req.body.phone,
        userFunction: req.body.userFunction
      }
    })

    res.redirect('/settings?success=true')
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).send('Error while updating user')
  }
}

const changeAvatar = async (req, res) => {
  const { file } = req.files
  const user = res.locals.user
  if (!file) return res.sendStatus(400)

  const uuid = require('uuid').v4()
  const fileName = `${uuid}-${file.name}`

  file
    .mv(__dirname + '/../public/upload/' + fileName)
    .then(async () => {
      // Send the response back
      let updateUser = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          avatar: 'upload/' + fileName
        }
      })
    })
    .catch(err => {
      //console.log(err)
      res.sendStatus(500)
    }) 
}

const changeBgImage = async (req, res) => {
  const { file } = req.files
  const user = res.locals.user
  if (!file) return res.sendStatus(400)

  const uuid = require('uuid').v4()
  const fileName = `${uuid}-${file.name}`

  file
    .mv(__dirname + '/../public/upload/' + fileName)
    .then(async () => {
      // Send the response back
      let updateUser = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          bgImage: 'upload/' + fileName
        }
      })
    })
    .catch(err => {
      //console.log(err)
      res.sendStatus(500)
    })
}

module.exports = {
  createUser,
  updateUser,
  changeAvatar,
  changeBgImage
}
