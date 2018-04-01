var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var config = require('../config.json');
// Middleware to check if user logged in
var auth = require('../auth/auth');
var DB = require('../db/db');
var db = new DB();

// Display register page
router.get('/', auth, function (req, res, next) {
    // User logged in
    if (req.auth) {
        res.redirect('/class');
    }
    else {
        // No user logged in
        res.render('register', { "err": null });
    }
})

// Register user
router.post('/', async (req, res, next) => {
    let email = req.body.email;
    let userid = djb2(email);
    let password = req.body.password;
    let type = req.body.type;
    let hash = bcrypt.hashSync(password, config.salt);
    let query = "email == " + email;
    try {
        await db.init();
        const snapshot = await db.getDoc(config.usersCollection, query, null);
        if (snapshot.size == 0) {
            await db.addUser(userid, email, hash, type);
            res.redirect('/login');
        }
        else {
            res.render('register', { "err": "User already exist" });
        }
    } catch (err) {
        res.render('register', { "err": "Error registering user" });
    }
})

function djb2(str) {
    let hash = 5381;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + char;
    }
    return hash;  
}

module.exports = router;
