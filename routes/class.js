var express = require('express');
var router = express.Router();

// Display login page
router.get('/', function (req, res, next) {
    res.render('mainview');
})

module.exports = router;
