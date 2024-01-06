const { exclude, prisma } = require('../utils/prisma')

const sendFriendRequest = async (req, res) => {
  const { friendId } = req.body
  const user = res.locals.user

  // check if already a request is sent from me to this user or the other way around

  const friendRequest = await prisma.request.findFirst({
    where: {
      OR: [
        {
          senderId: user.id,
          recieverId: friendId
        },
        {
          senderId: friendId,
          recieverId: user.id
        }
      ]
    }
  })

  if (friendRequest) {
    return res.status(400).json({
      error: 'Friend request already sent'
    })
  }

  const newFriendRequest = await prisma.request.create({
    data: {
      recieverId: friendId,
      senderId: user.id
    }
  })

  res.json({
    message: 'Friend request sent',
    data: newFriendRequest
  })
}

const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body
  const user = res.locals.user

  const friendRequest = await prisma.request.findFirst({
    where: {
      id: requestId
    }
  })

  if (!friendRequest) {
    return res.status(400).json({
      error: 'Friend request not found'
    })
  }

  const newFriend = await prisma.friends.create({
    data: {
      friend_id: friendRequest.senderId,
      user_id: friendRequest.recieverId
    }
  })

  // remove friend request
  await prisma.request.delete({
    where: {
      id: requestId
    }
  })

  res.json({
    message: 'Friend request accepted',
    data: newFriend
  })
}

const declineFriendRequest = async (req, res) => {
  const { requestId } = req.body
  const user = res.locals.user

  const friendRequest = await prisma.request.findFirst({
    where: {
      id: requestId
    }
  })

  if (!friendRequest) {
    return res.status(400).json({
      error: 'Friend request not found'
    })
  }

  await prisma.request.delete({
    where: {
      id: requestId
    }
  })

  res.json({
    message: 'Friend request declined',
    data: friendRequest
  })
}

const deleteFriend = async (req, res) => {
  const { friendId } = req.body
  const user = res.locals.user
  const friend = await prisma.friends.findFirst({
    where: {
      OR: [
        {
          user_id: user.id,
          friend_id: friendId
        },
        {
          user_id: friendId,
          friend_id: user.id
        }
      ]
    }
  })

  if (!friend) {
    return res.status(400).json({
      error: 'Friend not found'
    })
  }

  await prisma.friends.delete({
    where: {
      id: friend.id
    }
  })

  res.json({
    message: 'Friend deleted',
    data: friend
  })
}


const cancelFriendRequest = async (req, res) => {
  const { userId } = req.body
  const user = res.locals.user

  const friendRequest = await prisma.request.findFirst({
    where: {
      senderId: user.id,
      recieverId: userId
    }
  })

  if (!friendRequest) {
    return res.status(400).json({
      error: 'Friend request not found'
    })
  }

  await prisma.request.delete({
    where: {
      id: friendRequest.id
    }
  })

  res.json({
    message: 'Friend request cancelled',
    data: friendRequest
  })
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriend,
  cancelFriendRequest
}
