var express = require('express');
var router = express.Router();
var config = require('../config.json');
var DB = require('../db/db');
var db = new DB();

// Display list page
router.get('/', async (req, res, next) => {
    let classes = [];
    try {
        await db.init();
        const snapshot = await db.getDoc(config.classCollection);
        let foundClass = null;
        let classJson = null;
        snapshot.forEach(doc => {
            foundClass = doc.data();
            if (foundClass.classname && foundClass.vlink) {
                addlink = foundClass.vlink.length >= 2 ? foundClass.vlink[0] : foundClass.vlink;
                classJson = { "classname": foundClass.classname, "classid": foundClass.classid, "vlink": addlink };
                classes.push(classJson);
            }
        });
        res.render('list', { "classes": classes, "err": null });
    }
    catch (err) {
        res.render('list', { "classes": null, "err": "Error get classes for listing" });
    }
})

module.exports = router;
