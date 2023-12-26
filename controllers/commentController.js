const db = require("../db/prisma");

/**
 * Create a new comment
 * @param {*} req 
 * @param {*} res 
 */
const createComment = async (req, res) => {
  try {

    // testing the creation of a comment
    //to change later
    const comment = await db.comment.create({
      data: {
        content: "This is a test comment.",
        //fill other fields ...
      },
    });
  
    res.send("Comment Created successfully");
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send("Error while creating comment");
    // TODO:  redirect to an error page
  }
};

const updateComment = async (req, res) => {
  // const comment = db.comment.update({
  //   where: { id: parseInt(req.params.id) },
  //   data: req.body,
  // })
}

/*
Export important functions to use in other js files.
*/
module.exports = {
  createComment,
  updateComment
};
