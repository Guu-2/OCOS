var express = require('express');
const router = express.Router();


var { authentication, isAdmin } = require('../middleware/authentication');

const { validate } = require('../controllers/validator');

const { validationResult } = require('express-validator');

const userController = require('../controllers/user.controllers');


router.get('/' , (req, res) => {
    res.redirect('/login')
})

//TODO: Chia authRoute và check đăng nhập trong dtb
router.get('/login', function (req, res) {
    // Lấy flash message từ session
    var flashMessage = req.session.flash;
    if(flashMessage)
    {
        console.log(flashMessage);
    }
    // console.log(flashMessage);
    // Xóa flash message khỏi session
    delete req.session.flash;

    res.render('pages/login', { layout: false, flashMessage });

})
  .post('/login' , validate.validateLogin() ,userController.login)
  .post('/signup' , validate.validateSignup() ,userController.signup)
  .post('/logout', authentication,  userController.logout)

module.exports = router;

