const db = require('../db/dbConfig');

exports.getSigninPage = (req, res) => {
    const email = req.session.formData ? req.session.formData.email : '';
    let formData = req.session.formData || {};
    req.session.formData = { email };
    let error = "";
    
    // Check for signup success session variable
    const signupSuccess = req.session.signupSuccess === true;

    // Clear the session variable after using it
    req.session.signupSuccess = false;

    res.render('pages/signin.ejs', { signupSuccess, error, formData });
};

exports.postSignin = (req, res) => {
    const { email, password } = req.body;

    // Check the credentials against the 'user' table in the database
    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            // User found in the database, store user information in session
            const user = results[0];
            req.session.user = user;
            const userId = req.session.user.id;

            // Query the friends table to get friend IDs
            const friendQuery = 'SELECT friend_id FROM friends WHERE user_id = ?';

            db.query(friendQuery, [userId], (friendErr, friendResults) => {
                if (friendErr) {
                    console.error('Error retrieving friends:', friendErr);
                    return res.status(500).send('Internal Server Error');
                }

                // Extract friend IDs from the result
                const friendIds = friendResults.map(result => result.friend_id);

                // Query the posts table to get posts from friends
                const postQuery = 'SELECT * FROM post WHERE userId IN (?) ORDER BY createdAt DESC';
                db.query(postQuery, [friendIds], (postErr, postResults) => {
                    if (postErr) {
                        console.error('Error retrieving friend posts:', postErr);
                        return res.status(500).send('Internal Server Error');
                    }

                    // Pass the friend posts data to the acceuil page
                    const user = req.session.user;
                    return res.render('pages/home.ejs', { user, friendPosts: postResults });

                });
            });
        } else {
            // No user found with the provided credentials, display an error message
            req.session.formData = { email };
            let signupSuccess = req.session.signupSuccess;
          

            return res.render('pages/signin.ejs', { error: 'Invalid email or password', formData: req.session.formData ,signupSuccess});
        }
    });
};
