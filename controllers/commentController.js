const { exclude, prisma } = require('../utils/prisma')

const createComment = async (req, res) => {
  const user = res.locals.user;

  try {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.comment,
        userId: user.id,
        postId: req.body.postId,
      },
    });
  
    res.send("Comment Created successfully");
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send("Error while creating comment");
  }
};

const updateComment = async (req, res) => {
}


module.exports = {
  createComment,
  updateComment
};
