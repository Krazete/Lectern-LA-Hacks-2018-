var express = require('express');
var router = express.Router();
var config = require('../config.json');
// Middleware to check if user logged in
var auth = require('../auth/auth');
var DB = require('../db/db');
var db = new DB();

router.get('/:classid', auth, async (req, res, next) => {
    // User logged in
    if (req.auth) {
        let userid = req.uid;
        let classid = req.params.classid;
        let queryUID = "userid == " + userid;
        try {
            await db.init();
            const snapshot = await db.getDoc(config.classCollection, queryUID, null);
            if (snapshot.size != 0) {
                let foundClass = null;
                let viewClass = null;
                let classes = [];
                snapshot.forEach(doc => {
                    foundClass = doc.data();
                    classes.push(foundClass);
                    if (foundClass.classid == classid) {
                        viewClass = foundClass.classname;
                    }
                });
                console.log(classes);
                if (!viewClass) {
                    res.render('mainview', { "classname": classes[0].classname, "classes": classes });
                }
                else {
                    res.render('mainview', { "classname": viewClass, "classes": classes });
                }
            }
            else {
                res.redirect('/list');
            }
        }
        catch (err) {
            res.redirect('/list');
        }
    }
    else {
        res.redirect('/login');
    }
})

// Display login page
router.get('/', auth, async (req, res, next) => {
    // User logged in
    if (req.auth) {
        let userid = req.uid;
        let classid = req.params.classid;
        let queryUID = "userid == " + userid;
        try {
            await db.init();
            const snapshot = await db.getDoc(config.classCollection, queryUID, null);
            if (snapshot.size != 0) {
                let foundUserClass;
                let classes = [];
                snapshot.forEach(doc => {
                    foundUserClass = doc.data();
                    classes.push(foundUserClass);
                    console.log(classes);
                });
                res.redirect('/class/' + classes[0].classid);
            }
        }
        catch (err) {
            console.log(err);
            res.redirect('/list');
        }
    }
    else {
        // No user logged in
        res.redirect('/login');
    }
})

module.exports = router;
