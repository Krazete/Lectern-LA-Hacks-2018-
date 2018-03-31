var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var config = require('../config.json');
// Middleware to check if user logged in
var auth = require('../auth/auth');
var DB = require('../db/db');
var db = new DB();

// Save user uploaded video
router.post('/upload/:classid', auth, function (req, res, next) {
    // No user logged in
    if (!req.auth) {
        res.status(400).send("Unauthorized");
    }
    else {
        // User logged in
        db.init();
        let userid = req.uid;
        let classid = req.params.classid;
        let classname = req.body.classname;
        let video = req.body.video;
        try {

            await db.addClassWithVideo(classname, classid, video);
            res.send("Class updated");
        }
        catch (err) {
            res.status(500).send("Error saving video");
        }
    }
})