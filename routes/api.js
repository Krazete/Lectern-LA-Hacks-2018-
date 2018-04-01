var express = require('express');
var router = express.Router();
var config = require('../config.json');
// Middleware to check if user logged in
var auth = require('../auth/auth');
var DB = require('../db/db');
var db = new DB();

// Save user uploaded video
router.get('/note/:classid/:vlink', auth, async (req, res, next) => {
    // No user logged in
    if (!req.auth) {
        res.status(400).send("Unauthorized");
    }
    else {
        // User logged in
        let classid = req.params.classid;
        let vlink = req.params.vlink;
        let queryClassID = "classid == " + classid;
        let queryVlink = "vlink == " + vlink;
        try {
            await db.init();
            const snapshot = await db.getDoc(config.noteCollection, queryClassID, queryVlink);
            if (snapshot.size == 0) {
                res.json({note: ""});
            }
            else {
                let foundNote = null;
                snapshot.forEach(doc => {
                    foundNote = doc.data();
                });
                res.json({note: foundNote.note});
            }
        }
        catch (err) {
            res.status(500).send(err.message);
        }
    }
})

// Save user uploaded video
router.post('/note/:classid/:vlink', auth, async (req, res, next) => {
    // No user logged in
    if (!req.auth) {
        res.status(400).send("Unauthorized");
    }
    else {
        // User logged in
        let userid = req.uid;
        let classid = req.params.classid;
        let vlink = req.params.vlink;
        let note = req.body.note;
        let queryClassID = "classid == " + classid;
        let queryVlink = "vlink == " + vlink;
        try {
            await db.init();
            const snapshot = await db.getDoc(config.noteCollection, queryClassID, queryVlink);
            if (snapshot.size == 0) {
                await db.addNote(userid, classid, vlink, note);
            }
            else {
                let foundNote = null;
                let foundNoteID = null
                snapshot.forEach(doc => {
                    foundNote = doc.data();
                    foundNoteID = doc.id;
                });
                await db.updateNote(foundNoteID, note)
            }
            res.send("Saved note");
        }
        catch (err) {
            res.status(500).send(err.message);
        }
    }
})

module.exports = router;
