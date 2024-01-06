const { exclude, prisma } = require('../utils/prisma')

const home = async (req, res) => {
  let user = res.locals.user
  let friends = res.locals.friends

  let allUsersExceptMeAndFriends = await getUserSuggestions(req, res)
  let only5suggestions = allUsersExceptMeAndFriends.slice(0, 10)

  let posts = await prisma.post.findMany({
    where: {
      // my posts or my friend posts
      OR: [
        {
          userId: user.id
        },
        {
          userId: {
            in: friends.map(friend => friend.id)
          }
        }
      ]
    },
    include: {
      Comment: {
        // show user info
        include: {
          User: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
              id: true,
              gender: true,
              url: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      Likes: true,
      User: {
        select: exclude('user', ['password'])
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  res.render('../views/pages/home', { posts, suggestions: only5suggestions })
}

const getUserSuggestions = async (req, res) => {
  let user = res.locals.user
  let requestsSentOrReceived = await prisma.request.findMany({
    where: {
      OR: [
        {
          senderId: user.id // request sent by me
        },
        {
          recieverId: user.id // request sent to me
        }
      ]
    }
  })

  let usersThatSentMeRequests = requestsSentOrReceived.filter(request => request.recieverId === user.id)
  let usersThatIHaveSentRequests = requestsSentOrReceived.filter(request => request.senderId === user.id)
  let usersFilter = []
  usersThatSentMeRequests.forEach(request => {
    usersFilter.push(request.senderId)
    usersFilter.push(request.recieverId)
  })
  usersThatIHaveSentRequests.forEach(request => {
    usersFilter.push(request.senderId)
    usersFilter.push(request.recieverId)
  })
  // remove duplicates
  usersFilter = [...new Set(usersFilter)]
  // remove me from the list
  usersFilter = usersFilter.filter(id => id !== user.id)
  // remove my friends from the list
  usersFilter = usersFilter.filter(id => !res.locals.friends.map(friend => friend.id).includes(id))

  // get all users except me and my friends
  return await prisma.user.findMany({
    where: {
      AND: [
        {
          id: {
            not: user.id
          }
        },
        {
          id: {
            notIn: res.locals.friends.map(friend => friend.id)
          }
        },
        // user must not be in my sent requests or received requests
        {
          id: {
            notIn: usersFilter
          }
        }
      ]
    },
    include: {
      userFriends: true,
      RequestsReceived: true,
      RequestsSent: true
    }
  })
}

const suggestions = async (req, res) => {
  const allUsersExceptMeAndFriends = await getUserSuggestions(req, res)
  res.render('../views/pages/suggestions', { users: allUsersExceptMeAndFriends })
}

const network = async (req, res) => {
  res.render('../views/pages/network')
}

const settings = async (req, res) => {
  // get url param
  const { success } = req.query
  if (success) {
    res.render('../views/pages/settings', { success: true })
  } else {
    res.render('../views/pages/settings', { success: false })
  }
}

const friendRequests = async (req, res) => {
  const user = res.locals.user
  const myFriendRequests = await prisma.request.findMany({
    where: {
      recieverId: user.id
    },
    include: {
      User: true
    }
  })
  res.render('../views/pages/requests', { requests: myFriendRequests })
}

const userProfile = async (req, res) => {
  const { slug } = req.params
  const user = await prisma.user.findFirst({
    where: {
      url: slug
    },
    include: {
      Post: {
        include: {
          Comment: {
            // show user info
            include: {
              User: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  id: true,
                  gender: true,
                  url: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          Likes: true,
          User: {
            select: exclude('user', ['password'])
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!user) {
    return res.redirect('/')
  }
  const nbOfFriends = await prisma.friends.count({
    where: {
      OR: [
        {
          user_id: user.id
        },
        {
          friend_id: user.id
        }
      ]
    }
  })

  user.nbOfFriends = nbOfFriends

  const amIFriendsWithThisUser = await prisma.friends.findFirst({
    where: {
      OR: [
        {
          user_id: user.id,
          friend_id: res.locals.user.id
        },
        {
          user_id: res.locals.user.id,
          friend_id: user.id
        }
      ]
    }
  })

  user.amIFriendsWithThisUser = amIFriendsWithThisUser ? true : false

  const didIReceiveARequestFromThisUser = await prisma.request.findFirst({
    where: {
      senderId: user.id,
      recieverId: res.locals.user.id
    }
  })

  user.didIReceiveARequestFromThisUser = didIReceiveARequestFromThisUser ? true : false

  const didISendARequestToThisUser = await prisma.request.findFirst({
    where: {
      senderId: res.locals.user.id,
      recieverId: user.id
    }
  })

  user.didISendARequestToThisUser = didISendARequestToThisUser ? true : false

  const isThisUserMe = user.id === res.locals.user.id ? true : false
  user.isThisUserMe = isThisUserMe

  console.log(user)
  if (!user) {
    return res.redirect('/')
  }

  res.render('../views/pages/profile', { profile: user })
}

const searchPage = async (req, res) => {
  const { q } = req.query
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: q
          }
        },
        {
          lastName: {
            contains: q
          }
        }
      ]
    }
  })
  res.render('../views/pages/search', { users, search: q })
}

const aboutUs = async (req, res) => {
  res.render('../views/pages/aboutUs')
 
}

module.exports = {
  home,
  suggestions,
  network,
  settings,
  friendRequests,
  userProfile,
  searchPage,
  aboutUs

}
