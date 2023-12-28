const { check, validationResult } = require('express-validator');
const db = require('../db/dbConfig');

// Email verification middleware
const emailVerificationMiddleware = (req, res, next) => {
    const { firstName, lastName, email } = req.body;

    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM user WHERE email = ?';
    db.query(checkEmailQuery, [email], (emailErr, emailResults) => {
        if (emailErr) {
            console.error('Database query error:', emailErr);
            return res.status(500).send('Internal Server Error');
        }

        if (emailResults.length > 0) {
            // Email already exists, render signup page with an error message
            req.session.formData = { firstName, lastName, email }; // Store entered form data
            return res.render('pages/signup.ejs', { error: 'Email address already exists', formData: req.session.formData });
        }

        // Email is unique, proceed to the next middleware (password validation)
        next();
    });
};

exports.getSignupPage = (req, res) => {
    let error = "";
    let formData = req.session.formData || {};
    req.session.formData = {};

    res.render('pages/signup.ejs', { error, formData });
};

exports.postSignup = [emailVerificationMiddleware,
    check('password')
        .isLength({ min: 7 }).withMessage('Password must be at least 7 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)
        .withMessage('Password must contain at least one number, and one special character'),
    async (req, res) => {
        const { firstName, lastName, email, password, confirmedPassword } = req.body;

        // Validate input on the server side
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Store the form data and render the signup page with the error messages
            req.session.formData = { firstName, lastName, email }; // Store entered form data
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('pages/signup.ejs', { error: errorMessages, formData: req.session.formData });
        }

        // Check if the passwords match
        if (password !== confirmedPassword) {
            // Store the form data and render the signup page with the error message
            req.session.formData = { firstName, lastName, email }; // Store entered form data
            return res.render('pages/signup.ejs', { error: 'Passwords do not match', formData: req.session.formData });
        }
        delete req.session.formData;

        // Proceed with user registration
        const insertUserQuery = 'INSERT INTO user (firstName, lastName, email, password, createdAt) VALUES (?, ?, ?, ?, NOW())';
        db.query(insertUserQuery, [firstName, lastName, email, password], (insertErr, insertResults) => {
            if (insertErr) {
                console.error('Database query error:', insertErr);
                return res.status(500).send('Internal Server Error');
            }
            req.session.signupSuccess = true;

            // Redirect to the signin page upon successful signup
            res.redirect('/signin');

        });
    }];
