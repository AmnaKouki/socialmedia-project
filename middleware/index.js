const jwt = require('jsonwebtoken')
const { exclude, prisma } = require('../utils/prisma')
function notFound(req, res, next) {
  res.render('../views/pages/404').status(404)
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  })
}
function findUserById(id) {
  // with friends number and posts number
  return prisma.user.findUnique({
    where: {
      id
    },
    include: {
      Post: true,
      RequestsReceived: true,
      RequestsSent: true,
      userFriends: true,
      friendUserFriends: true
    }
  })
}

// get user friends
async function getMyFriends(user) {
  let user_id = user.id
  let userFriends = user.userFriends
  let friendUserFriends = user.friendUserFriends

  let friends_ids = []
  // loop through userFriends and get their ids
  userFriends.forEach(friend => {
    friends_ids.push(friend.user_id)
    friends_ids.push(friend.friend_id)
  })

  // loop through friendUserFriends and get their ids
  friendUserFriends.forEach(friend => {
    friends_ids.push(friend.user_id)
    friends_ids.push(friend.friend_id)
  })

  // remove duplicates
  friends_ids = [...new Set(friends_ids)]
  // remove my id
  friends_ids = friends_ids.filter(id => id !== user_id)

  // get all my friends
  let friends = await prisma.user.findMany({
    where: {
      id: {
        in: friends_ids
      }
    },
    select: exclude('user', ['password'])
  })

  return friends
}

async function isAuthenticated(req, res, next) {
  const { token } = req.cookies
  //console.log('token', token)

  if (!token) {
    return res.status(301).redirect('/auth/login?error=2')
    // res.status(301).redirect('/auth/login') // You must be logged in to access this page
    // //throw new Error('Unauthorized')
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    req.payload = payload

    let user = await findUserById(payload.userId)

    let userFriends = await getMyFriends(user)
    res.locals.user = user
    res.locals.friends = userFriends
  } catch (err) {
    console.error(err)
    res.status(301).redirect('/auth/login?error=2') // You must be logged in to access this page
    if (err.name === 'TokenExpiredError') {
      // Cannot set headers after they are sent to the client
      return next()
    }
    throw new Error('Unauthorized')
  }

  return next()
}

module.exports = {
  notFound,
  errorHandler,
  isAuthenticated
}
