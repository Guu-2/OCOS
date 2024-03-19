var express = require('express');
const router = express.Router();


var { authentication, isAdmin } = require('../middleware/authentication');

const { validate } = require('../controllers/validator');

const { validationResult } = require('express-validator');

const userController = require('../controllers/user.controllers');

const sendEmail = require('../controllers/sendEmail');

router.get('/', (req, res) => {
  res.redirect('/profile')
})
  //TODO: fix lỗi delay
  .get('/profile', authentication, async function (req, res, next) {
    const partial = 'partials/profile';
    if (req.session.status == 'intial') {
      var endpoint = '/home/intial';
    } else {
      var endpoint = '/home/profile';
    }

    if (req.session.role === "admin") {
      var layout = 'layouts/admin';
    }
    else {
      var layout = 'layouts/main';
    }

    req.partial_path = partial
    req.layout_path = layout
    req.endpoint = endpoint
    await userController.getpage(req, res, next);

  })
  .post('/change_name', authentication, validate.validateChangeFullname(), userController.changeFullname)
  .post('/change_pass', authentication, validate.validateChangePassword(),userController.changePassword)
  .get('/profile/:id', authentication, async function (req, res, next) {
    console.log(req.params.id)
    const partial = 'partials/profile_manager';
    const layout = 'layouts/admin';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      account_details: await userController.getAccount(req.params.id)
    }
    // console.log(req.page_data.account_details)
    await userController.getpage(req, res, next);

  })
  .post('/resend_email', authentication, isAdmin,  async function (req, res, next) {
    const {email , accountId} = req.body;
    await sendEmail.sendConfirmationEmail(email, accountId);
    res.json({ send: true, status: "success", message: "Email has been sent to: " +email});
  })
  .post('/lock_account' , authentication , isAdmin , userController.togglelockAccount);



module.exports = router;

