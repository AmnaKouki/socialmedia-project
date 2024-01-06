const { exclude, prisma } = require('../utils/prisma')
const { hashToken } = require('../utils/hashToken')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { generateTokens } = require('../utils/jwt')
const dayjs = require('dayjs')
const slug = require('slug')

const showLoginPage = (req, res) => {
  // get params from url
  const { error } = req.query
  let errorMsg = ''
  switch (error) {
    case '1':
      errorMsg = 'Wrong email or password'
      break
    case '2':
      errorMsg = 'You must be logged in to access this page'
      break
    default:
      errorMsg = ''
  }
  res.render('../views/pages/login', { errorMsg })
}


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      // res.status(400)
      // throw new Error('You must provide an email and a password.')
      res.status(301).redirect('/auth/login?error=1') // Wrong email or password
    }

    const existingUser = await findUserByEmail(email)

    if (!existingUser) {
      res.status(301).redirect('/auth/login?error=1') // Wrong email or password
    }

    const validPassword = await bcrypt.compare(password, existingUser.password)
    if (!validPassword) {
      res.status(301).redirect('/auth/login?error=1') // Wrong email or password
    }

    const jti = uuidv4()
    const { accessToken, refreshToken } = generateTokens(existingUser, jti)
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id })

    // res.json({
    //   accessToken,
    //   refreshToken
    // })
    res.cookie('token', accessToken, { httpOnly: true })
    res.cookie('refreshToken', refreshToken, { httpOnly: true })

    res.redirect('/')
    

  } catch (err) {
    next(err)
  }
}

const register = async (req, res, next) => {
  try {
   
    const { email, password, firstName, lastName, birthday, userFunction, description, address, country, phone, gender } = req.body
    if (!email || !password) {
      res.status(400)
      throw new Error('You must provide an email and a password.')
    }

    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      res.status(400)
      throw new Error('Email already in use.')
    }



    const cryptedPassword = bcrypt.hashSync(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        password: cryptedPassword,
        firstName,
        lastName,
        gender,
        birthday: dayjs(birthday).toISOString(),
        userFunction,
        description,
        address,
        country,
        phone,
        url: slug(`${firstName} ${lastName}`),
        avatar: gender === 'MALE' ? '/assets/images/avatar/male.png' : '/assets/images/avatar/female.png',
        bgImage: '/assets/images/bg/08.jpg',
      }
    })
    const jti = uuidv4()
    const { accessToken, refreshToken } = generateTokens(user, jti)
    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id })

    // res.json({
    //   accessToken,
    //   refreshToken
    // })
    res.cookie('token', accessToken, { httpOnly: true })
    res.cookie('refreshToken', refreshToken, { httpOnly: true })

    res.redirect('/')
  } catch (err) {
    next(err)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400)
      throw new Error('Missing refresh token.')
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const savedRefreshToken = await findRefreshTokenById(payload.jti)

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    const hashedToken = hashToken(refreshToken)
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    const user = await findUserById(payload.userId)
    if (!user) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    await deleteRefreshToken(savedRefreshToken.id)
    const jti = uuidv4()
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti)
    await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id })

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    })
  } catch (err) {
    next(err)
  }
}

const revokeRefreshTokens = async (req, res, next) => {
  try {
    const { userId } = req.body
    await revokeTokens(userId)
    res.json({ message: `Tokens revoked for user with id #${userId}` })
  } catch (err) {
    next(err)
  }
}

function addRefreshTokenToWhitelist({ jti, refreshToken, userId }) {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId
    }
  })
}

function findRefreshTokenById(id) {
  return prisma.refreshToken.findUnique({
    where: {
      id
    }
  })
}

function deleteRefreshToken(id) {
  return prisma.refreshToken.update({
    where: {
      id
    },
    data: {
      revoked: true
    }
  })
}

function revokeTokens(userId) {
  return prisma.refreshToken.updateMany({
    where: {
      userId
    },
    data: {
      revoked: true
    }
  })
}

function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}

function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id
    }
  })
}

function logout(req, res) {
  res.clearCookie('token')
  res.clearCookie('refreshToken')
  res.redirect('/auth/login')
}

function showRegisterPage(req, res)  {
  res.render('../views/pages/signup')
};

module.exports = {
  login,
  showLoginPage,
  register,
  refreshToken,
  revokeRefreshTokens,
  logout,
  showRegisterPage,
}
