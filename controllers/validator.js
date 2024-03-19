const { check } = require('express-validator');


let validateLogin = () => {
    return [
        check('username', 'username does not Empty' ).not().isEmpty(),
        check('password','password does not Empty').not().isEmpty(),
    ];
}


let validateInfoStaff = () => {
    return [
        check('fullname', 'full name does not Empty').not().isEmpty(),
        check('email', 'email does not Empty').not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('role', 'Invalid role').isIn(['manager', 'staff']),
        check('role', 'Invalid role').custom((value, { req }) => {
            if (value === 'manager') {
              if (!req.body.access || !Array.isArray(req.body.access) || req.body.access.length === 0) {
                throw new Error('Access cannot be empty for manager role');
              }
            }
            return true;
          }),
    ];
}


const validateInfoProduct = () => {
  return [
    check('productname', 'Product name is required').not().isEmpty(),
    check('importprice', 'Import price is required').not().isEmpty().isNumeric().withMessage('Import price must be a number'),
    check('retailprice', 'Retail price is required').not().isEmpty().isNumeric().withMessage('Retail price must be a number'),
    check('inventory', 'Inventory is required').not().isEmpty(),
    check('category', 'Invalid category').isIn(['phone', 'accessories'])
  ];
};


let validateChangeFullname = () => {
  return [
      check('fullname', 'fullname does not Empty' ).not().isEmpty(),
  ];
}


let validateChangeDefaultPassword = () => {
  return [
      check('newpass','new password does not Empty').not().isEmpty(),
      check('renewpass','repeat new password does not Empty').not().isEmpty(),
      check('renewpass').custom((value, { req }) => {
        if (value !== req.body.newpass) {
          throw new Error('Password confirmation does not match');
        }
        return true;
      }),
  ];
}

let validateChangePassword = () => {
  return [
      check('currpass', 'current password does not Empty' ).not().isEmpty(),
      check('newpass','new password does not Empty').not().isEmpty(),
      check('renewpass','repeat new password does not Empty').not().isEmpty(),
      check('renewpass').custom((value, { req }) => {
        if (value !== req.body.newpass) {
          throw new Error('Password confirmation does not match');
        }
        return true;
      }),
  ];
}

var validate = {
    validateLogin: validateLogin,
    validateInfoStaff:validateInfoStaff,
    validateInfoProduct:validateInfoProduct,
    validateChangeFullname: validateChangeFullname,
    validateChangePassword: validateChangePassword,
    validateChangeDefaultPassword: validateChangeDefaultPassword,


};

module.exports = { validate };



