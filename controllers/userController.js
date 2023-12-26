const db = require("../db/prisma");

/**
 * Create a new user
 * @param {*} req 
 * @param {*} res 
 */
const createUser = async (req, res) => {
  try {

    // testing the creation of a user
    //to change later
    const user = await db.user.create({
      data: {
        firstName: "Foulen 2",
        lastName: "Fouleni 2",
        birthday: new Date("01-01-2019"),
        email: "test2@test.com",
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
    });
  
    res.send("User Created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error while creating user");
    // TODO:  redirect to an error page
  }
};

const updateUser = async (req, res) => {
  // const user = db.user.update({
  //   where: { id: parseInt(req.params.id) },
  //   data: req.body,
  // })
}

/*
Export important functions to use in other js files.
*/
module.exports = {
  createUser,
  updateUser
};
