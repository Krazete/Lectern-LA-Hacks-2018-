var jwt = require('jsonwebtoken');
var config = require('../config.json');

async function auth(req, res, next) {
  let token = req.cookies[config.jwtCookie];
  if (!token) { // jwt cookie not incl in header
    req.auth = false;
    next();
  }
  else {  // jwt cookie incl, verify it
    try {
      const decoded = await jwt.verify(token, config.secret);
      // User is authorized
      req.uid = decoded.uid;
      req.utype = decoded.utype;
      req.auth = true;
      next();

    } catch (err) { // Bad or expired token
        req.auth = false;
        next();
    }
  }
}

module.exports = auth;
