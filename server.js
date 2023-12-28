const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
require("dotenv").config(); // can use .env files
const logger = require('morgan')
const session = require('express-session');
//const crypto = require('crypto');
/**
 * Config
 */
const port = process.env.PORT || 3000; // default port
app.set("view engine", "ejs"); // use ejs
app.use(bodyParser.urlencoded({ extended: true })); // can use post data
app.use(express.static("public")); // add public folder
app.use(logger('combined'))
app.use(express.json());
app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: true,
    saveUninitialized: true
}));

// ============================================

// MySQL connection
const db = require('./db/dbConfig');
// ============================================
// Routes of Hayfa 
const homeRoute = require('./routes/homeRoute');
const signinRoute = require('./routes/signinRoute');
const signupRoute = require('./routes/signupRoute');

app.use(homeRoute);
app.use(signinRoute);
app.use(signupRoute);


// end of routes of Hayfa
const homeRouter = require("./routes/home")
const authRouter = require("./routes/auth")

app.use("/", homeRouter);
app.use("/auth", authRouter)

app.listen(port);
console.log(`Server is running on http://localhost:${port}`);
