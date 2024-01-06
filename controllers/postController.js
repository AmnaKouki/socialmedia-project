const { exclude, prisma } = require('../utils/prisma')
const fs = require('fs')
const createPost = async (req, res) => {
  const { content } = req.body
  let user = res.locals.user
  const post = await prisma.post.create({
    data: {
      content,
      userId: user.id
    }
  })

  res.json({ message: 'Post created', post })
}

const uploadImage = async (req, res) => {
  const { file } = req.files
  // If no image submitted, exit
  if (!file) return res.sendStatus(400)
  //unique name using uuid
  const uuid = require('uuid').v4()
  const fileName = `${uuid}-${file.name}`
  // Move the uploaded image to our upload folder
  file
    .mv(__dirname + '/../public/upload/' + fileName)
    .then(() => {
      // Send the response back
      res.json({
        success: 1,
        file: {
          url: `/upload/${fileName}`
        }
      })
    })
    .catch(err => {
      //console.log(err)
      res.sendStatus(500)
    })
}

const postImage = async (req, res) => {
  const { content, imageUploadedUrl } = req.body
  let user = res.locals.user

  const post = await prisma.post.create({
    data: {
      content,
      image: imageUploadedUrl,
      userId: user.id
    }
  })

  res.redirect('/')
}

const deletePost = async (req, res) => {
  const { id } = req.body
  let user = res.locals.user

  const post = await prisma.post.delete({
    where: {
      id: parseInt(id)
    },
    
  })

  res.json({ message: 'Post deleted' })
}

const likePost = async (req, res) => {
  const { postId } = req.body
  let user = res.locals.user

  // if post is already liked, unlike it
  const like = await prisma.like.findFirst({
    where: {
      likedById: user.id,
      postId: parseInt(postId)
    }
  })

  if (like) {
    await prisma.like.delete({
      where: {
        id: like.id
      }
    })
    return res.json({ message: 'Post unliked' })
  }

  // if post is not liked, like it
  await prisma.like.create({
    data: {
      likedById: user.id,
      postId: parseInt(postId)
    }
  })

  res.json({ message: 'Post liked'})
}


module.exports = {
  createPost,
  uploadImage,
  postImage,
  deletePost,
  likePost,
}
