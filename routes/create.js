var express = require('express');
var router = express.Router();
var config = require('../config.json');
// Middleware to check if user logged in
var auth = require('../auth/auth');
var DB = require('../db/db');
var db = new DB();

// Display create page
router.get('/', auth, async (req, res, next) => {
    // User logged in
    if (req.auth) {
        res.render('create', { "userid": req.uid, "err": null, "msg": null });
    }
    else {
        // No user logged in
        res.redirect('/login');
    }
})

// Create new class
router.post('/', auth, async (req, res, next) => {
    let userid = req.uid;
    let classname = req.body.classname;
    let vlink = req.body.vlink;
    let classid = djb2(classname);
    let queryUID = "userid == " + userid;
    let queryClassID = "classid == " + classid;
    try {
        await db.init();
        const snapshot = await db.getDoc(config.classCollection, queryUID, queryClassID);
        if (snapshot.size != 0) {
            // let foundClass;
            // snapshot.forEach(doc => {
            //     foundClass = doc.data();
            //     console.log(foundClass);
            // });
            res.render('create', { "userid": userid, "err": "Class already exist", "msg": null });
        }
        else {
            await db.addClass(userid, classid, classname, vlink);
            res.redirect('/class/' + classid);
            // let classid
            // const apiRes = await fetch(config.endpointUrl + 'api/upload/' + userid + '/' + classid, {
            //     method: 'POST',
            //     headers: {
            //         cookie: config.jwtCookie + '=' + req.cookies[config.jwtCookie]
            //     }                
            // });
            // if (apiRes.status == 200) {
            //     res.redirect('/class');
            // }
            // else {
            //     res.status(400).send("Error creating class");
            // }
        }
    } catch (err) {
        res.render('create', { "userid": userid, "err": err, "msg": null });
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
