const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
require("dotenv").config(); // can use .env files
const logger = require('morgan')

/**
 * Config
 */
const port = process.env.PORT || 3000; // default port
app.set("view engine", "ejs"); // use ejs
app.use(bodyParser.urlencoded({ extended: true })); // can use post data
app.use(express.static("public")); // add public folder
app.use(logger('combined'))
app.use(express.json());
// ============================================


const homeRouter = require("./routes/home")
const authRouter = require("./routes/auth")

app.use("/", homeRouter);
app.use("/auth", authRouter)

app.listen(port);
console.log("Server is listening on port 3000");
