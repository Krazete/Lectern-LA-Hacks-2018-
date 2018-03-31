var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config.json');
// Middleware to check if user logged in
var auth = require('../auth/auth');
var DB = require('../db/db');
var db = new DB();

// Display login page
router.get('/', auth, function (req, res, next) {
    // User logged in
    if (req.auth) {
        res.redirect('/class');
    }
    else {
        // No user logged in
        res.render('login', { "err": null, "msg": null });
    }
})

// Authenticate user
router.post('/', async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let query = "email == " + email;
    try {
        await db.init();
        const snapshot = await db.getDoc(config.usersCollection, query);
        if (snapshot.size == 0) {
            res.render('login', { "err": "User not exist", "msg": null });
        }
        else {
            let foundUser;
            snapshot.forEach(doc => {
                foundUser = doc.data();
            });
            console.log(foundUser.hash);
            // Hash provided password to compare with hash in db
            if (bcrypt.compareSync(req.body.password, foundUser.hash)) {
                const token = await jwt.sign({ uid: foundUser.userid }, config.secret);
                res.cookie(config.jwtCookie, token);
                res.redirect('/class');
            }
            else {
                res.render('login', { "err": "Incorrect email or password", "msg": null });
            }
        }
    } catch (err) {
        res.render('login', { "err": "Error authenticating user", "msg": null });
    }
})

module.exports = router;
