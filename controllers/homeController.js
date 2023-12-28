const db = require('../db/dbConfig');

exports.getHomePage = (req, res) => {
// Check if the user is authenticated
if (!req.session.user) {
    // If not authenticated, redirect to the signin page
    return res.redirect('/signin');
  }

  // If authenticated, render the home page
  res.render('pages/home.ejs', { user: req.session.user });
};