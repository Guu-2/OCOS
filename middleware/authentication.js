
const jwt = require("jsonwebtoken");



// middleware/authentication.js
function authentication(req, res, next) {
  if (req.session.loggedIn) {
    next();
  }
  else {
    res.redirect('/login');
  }
}



function isAdmin(req, res, next) {
  if(req.session.isAdmin){
    next();
  }
  else {
    res.redirect('/home/order');
  }
}

module.exports = { authentication , isAdmin };