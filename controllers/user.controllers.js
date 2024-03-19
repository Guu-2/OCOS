const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mailer = require('../utils/mailer')
const moment = require('moment');

var { authentication, isAdmin } = require('../middleware/authentication');
const sendEmail = require('./sendEmail');
const { validate } = require('../controllers/validator');

const { validationResult } = require('express-validator');
const { stat } = require('fs');

const admin_feature_list = [
  { access: "Staff Manager", icon: "<i class='bx bx-grid-alt'></i>" },
  { access: "Product Manager", icon: "<i class='bx bx-grid-alt'></i>" },
  { access: "Customer Manager", icon: "<i class='bx bx-grid-alt'></i>" },
  { access: "Transaction", icon: "<i class='fa-solid fa-cart-plus'></i>" },
  { access: "Statistical", icon: "<i class='fa-solid fa-signal'></i>" }
]

const staff_feature_list = [
  { access: "New Order", icon: "<i class='fa-solid fa-cart-plus'></i>" },
  { access: "Statistical", icon: "<i class='fa-solid fa-signal'></i>" }
]



class UserController {
  // account có quyền hạn cao nhất các account sau đó được phân chia quyền hạn dựa trên admin
  createDefaultAccount() {
    console.log("DEFAULT ADMIN : ")
    return new Promise(async (resolve, reject) => {
      try {
        const admin = await User.findOne({ username: 'admin' });
        const currentTime = moment().format("HH:mm | DD/MM/YYYY");

        if (!admin) {
          const defaultpassword = await bcrypt.hash("admin", parseInt(process.env.BCRYPT_SALT_ROUND));
          const mail_sender = "admin@gmail.com"
          const defaultAdmin = new User({
            username: 'admin',
            // Trong thực tế, hãy sử dụng mã hóa mật khẩu bằng bcrypt hoặc một thư viện tương tự
            password: defaultpassword,
            email: mail_sender,
            fullName: 'Admin',
            role: 'admin',
            access: admin_feature_list,
            profilePicture: '../images/dejault_avatar.png',
            status: 'active',
            lastLogin: currentTime,
          });
          await defaultAdmin.save();
          resolve(); // Tài khoản mặc định đã được tạo thành công
        } else {
          // console.log('Tài khoản admin đã tồn tại.');
          resolve(); // Tài khoản admin đã tồn tại
        }
      } catch (error) {
        // console.error('Lỗi khi tạo tài khoản admin mặc định:', error);
        reject(error); // Xảy ra lỗi khi tạo tài khoản
      }
    });
  }





  async login(req, res, next) {
    console.log("LOGIN : ")
    try {
      req.session.admin_feature = admin_feature_list;
      req.session.staff_feature = staff_feature_list;


      // Kiểm tra thông tin đăng nhập và xác thực
      // console.log("HERE");
      // console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        var err_msg = "";
        var list_err = errors.array();
        list_err.forEach(err => {
          err_msg += err.msg + " , ";
        });

        console.log(err_msg);

        //CƠ CHẾ CỦA VALIDATOR KHÔNG CHO ĐI TIẾP
        var state = { status: 'warning', message: err_msg };
        res.json({ status: state.status, message: state.message, redirect: "" });

      }
      else {
        const { username, password } = req.body;
        const find = await User.findOne({ username: username });
        if (!find) {
          var state = { status: 'warning', message: 'Account not found' }
        }
        else {
          var check_password = await bcrypt.compare(password, find.password);
          if (check_password) {
            req.session.account = find._id.toString();
            req.session.role = find.role
            req.session.access = find.access
            req.session.status = find.status
            if (find.status === 'inactive') {
              var state = { status: 'warning', message: 'Please login by clicking on the link in your email' }
            }
            else if (find.status === 'intial') {
              var state = { status: 'success', message: 'Firsttime please change password' }

            } else {

              console.log(req.session.status)

              const token = jwt.sign({ accountId: find._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });
              res.cookie("remember", token, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Lưu cookie trong 30 ngày

              var state = { status: 'success', message: 'Login successful' }
            }


          } else {
            var state = { status: 'warning', message: 'Invalid password' }
          }

        }

        if (state.status == "success") {
          req.session.loggedIn = true;
          if (req.session.role == "admin" || req.session.role == "manager") {
            req.session.isAdmin = true;
            var goto = '/admin/staff'
          }
          else {
            if (find.status === 'intial') {
              var goto = '/home/intial'
            }
            else {
              var goto = '/home/order'
            }
          }
        }
        else {
          var goto = '/login'
        }
        // Các xử lý khác sau khi đăng nhập thành công
        // Đăng nhập thành công, tạo flash message
        req.session.flash = {
          type: state.status,
          intro: 'login feature',
          message: state.message,
        };
        res.json({ status: state.status, message: state.message, redirect: goto });

      }


    } catch (error) {

      next(error);
    }
  }


  async getliststaff() {
    try {

      const find = await User.find({ $or: [{ role: 'staff' }, { role: 'manager' }] });
      // console.log(find);

      return find
    } catch (error) {
      console.log(error);
    }
  }



  async addnewstaff(req, res, next) {
    console.log("ADD new staff : ")
    try {


      // Lấy các giá trị từ Form Data
      // const fullname = req.body.fullname;
      // const email = req.body.email;
      // const role = req.body.role;

      const errors = validationResult(req);
      // console.log(errors);

      if (!errors.isEmpty()) {
        var err_msg = "";
        var list_err = errors.array();
        list_err.forEach(err => {
          err_msg += err.msg + " , ";
        });

        console.log(err_msg);

        //CƠ CHẾ CỦA VALIDATOR KHÔNG CHO ĐI TIẾP
        var state = { status: 'warning', message: err_msg };
        res.json({ added: false, status: state.status, message: state.message });
      } else {
        const { fullname, email, role } = req.body;
        const currentTime = moment().format("HH:mm | DD/MM/YYYY");
        if (role === "manager") {
          var access = req.body.access;
          const filteredFeatures = admin_feature_list.filter(feature => access.includes(feature.access));
          var access = filteredFeatures;
          var status = "active";
        }
        else {
          var access = staff_feature_list;
          var status = "inactive";
        }
        console.log(fullname, email, access, role);
        const find = await User.findOne({ email: email });
        if (!find) {
          const defaultpassword = await bcrypt.hash(email.split("@")[0], parseInt(process.env.BCRYPT_SALT_ROUND));
          // console.log(defaultpassword);
          const newAccount = new User({
            username: email.split("@")[0],
            // Trong thực tế, hãy sử dụng mã hóa mật khẩu bằng bcrypt hoặc một thư viện tương tự
            password: defaultpassword,
            email: email,
            fullName: fullname,
            role: role,
            access: access,
            profilePicture: '../images/dejault_avatar.png',
            status: status,
            lastLogin: currentTime,
          });

          // res.json({ added: true, status: "success", message: "Add staff successfully" });
          await newAccount.save()
            .then((savedAccount) => {
              // Lưu thành công
              if (status === "inactive") {
                //SAI NGỮ CẢNH NÊN KHÔNG DÙNG ĐƯỢC sendMail
                // this.resendEmail(email , savedAccount._id.toString())
                sendEmail.sendConfirmationEmail(email, savedAccount._id.toString());
              }
              console.log('Account saved successfully:');
              // Thực hiện các hành động tiếp theo ở đây
              res.json({ added: true, status: "success", message: "Add staff successfully", account: savedAccount });
            }).catch((error) => {
              // Xử lý lỗi nếu quá trình lưu không thành công
              console.error('Error saving account:', error);
              res.json({ added: false, status: "error", message: "Failed to add staff" });
            })
        }
        else {
          // res.json({ added: true, status: "success", message: "Add staff successfully" });
          res.json({ added: false, status: "warning", message: "Account already exists" });
        }
      }




    } catch (error) {

      next(error);
    }
  }
  //Kiểm tra trạng thái có được phép truy cập hay không
  //Tạm thời chỉ check trạng thái có hợp lệ => phát triển xác thực quyền hạn (lưu quyền hạn từng account vào dtb)


  async getpage(req, res, next) {
    console.log("get page : " + req.partial_path)
    try {
      const partial = req.partial_path
      const layout = req.layout_path

      // console.log(partial, layout);
      // console.log(req.session.account)
      const verifyaccess = await this.verifyAccess(req.session.account);
      const account = await this.getAccount(req.session.account)
      if(account.lock){
        var state = { status: 'warning', message: 'Account has been locked' };
        req.session.flash = {
          type: state.status,
          intro: 'lock feature',
          message: state.message,
        };
        res.redirect("/login")
      }
      else if (verifyaccess) {
        const sidebar = req.session.access;

        //TODO: chỗ này tùy chỉnh tùy theo page
        const data_render = req.page_data ? req.page_data : "";
        // Lấy flash message từ session
        var flashMessage = req.session.flash;
        if (flashMessage) {
          console.log(flashMessage);
        }
        // Xóa flash message khỏi session
        delete req.session.flash;
        //RENDER KHÁC VỚI JSON NÓ VẪN CHẠY TIẾP

        console.log("data: ", data_render)
        res.render(partial, { layout: layout, access: sidebar, account: account, flashMessage, data: data_render });
      } else {

        var state = { status: 'warning', message: 'Chưa có quyền truy cập vào tính năng này' };
        var endpoint = req.endpoint
        
        //SAU KHI ĐÃ GỬI THÌ KHÔNG ĐƯỢC SET
        req.session.flash = {
          type: state.status,
          intro: 'intial login feature',
          message: state.message,
        };
        //TODO: chỉnh lại tùy biến cho truy cập vào access không được cấp quyền
        if (endpoint) {
          res.redirect(endpoint);
        }

      }
    } catch (error) {
      next(error);
    }
  }

  async getAccount(accountID) {
    console.log("curr account : " + accountID)
    try {
      const find = await User.findById(accountID);
      // console.log(find)
      if (find) {
        return find;
      }
      else {
        return "";
      }
    } catch (error) {

      console.log(error);
    }
  }


  //chỉ verify cho account có status là inactive
  //nếu account đã kích hoạt nhảy page
  async verifyAccount(req, res, next) {
    console.log("Verify staff account: ")
    try {
      const token = req.query.token;
      console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded)
      const accountId = decoded.accountId;
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        throw new Error('Token has expired');
      }
      // Xác minh thành công, trả về userId
      // res.json(accountId);
      const find = await User.findById(accountId);
      if (find) {
        find.status = "intial"; // Cập nhật trường "status" thành "intial"
        await find.save(); // Lưu thay đổi
        res.redirect('/login')
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyAccess(accountID) {
    console.log("Verify access of account: ")
    try {
      const find = await User.findById(accountID);
      // console.log(find)
      if (find) {
        if (find.status === "intial") {
          return false;
        } else {
          return true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async togglelockAccount(req, res, next) {
    console.log("Lock and Unlock account: ")
    try {
      const { accountID } = req.body;
      console.log(accountID)
      const find = await User.findById(accountID);
      // // console.log(find)
      if (find) {
        if (find.lock == false) {
          find.lock = true;
          var tmp = 'OPEN';
        } else {
          find.lock = false;
          var tmp = 'CLOSE';
        }
        await find.save(); // Lưu thay đổi
        var state = { locked: true, status: "success", message: "Account lock status: " + tmp};

      }
      else {
        var state = { added: false, status: "warning", message: "An error occur" };

      }
      req.session.flash = {
        type: state.status,
        intro: 'toggle lock account feature',
        message: state.message,
      };
      res.json(state);
    } catch (error) {
      next(error);
    }
  }



  async changeFullname(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        var err_msg = "";
        var list_err = errors.array();
        list_err.forEach(err => {
          err_msg += err.msg + " , ";
        });

        console.log(err_msg);

        //CƠ CHẾ CỦA VALIDATOR KHÔNG CHO ĐI TIẾP
        var state = { status: 'warning', message: err_msg };
        res.json({ changed: false, status: state.status, message: state.message });
      } else {
        const { fullname } = req.body; // Lấy dữ liệu từ yêu cầu
        console.log(fullname)
        // Do something with the fullname
        const find = await User.findById(req.session.account);
        if (find) {
          find.fullName = fullname;
          await find.save(); // Lưu thay đổi
          req.session.flash = {
            type: 'success',
            intro: 'Change fullname',
            message: 'Fullname has been changed successfully',
          };
          res.json({
            changed: true,
            status: 'success',
            message: 'Fullname has been changed successfully'
          });
        } else {
          req.session.flash = {
            type: 'warning',
            intro: 'Change fullname',
            message: 'Fullname changed fail',
          };
          res.json({
            changed: true,
            status: 'warning',
            message: 'Fullname changed fail'
          });
        }
      }

    } catch (error) {

      next(error);
    }
  }

  async changeDefaultPassword(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        var err_msg = "";
        var list_err = errors.array();
        list_err.forEach(err => {
          err_msg += err.msg + " , ";
        });

        console.log(err_msg);

        //CƠ CHẾ CỦA VALIDATOR KHÔNG CHO ĐI TIẾP
        var state = { status: 'warning', message: err_msg };
        res.json({ changed: false, status: state.status, message: state.message });
      }
      else {
        const { newpass, renewpass } = req.body;
        console.log(newpass, renewpass);

        const find = await User.findById(req.session.account);
        if (!find) {
          var state = { status: 'warning', message: 'Account not found' }
        }
        else {
          const newpassword = await bcrypt.hash(newpass, parseInt(process.env.BCRYPT_SALT_ROUND));
          find.password = newpassword;
          find.status = 'active'
          await find.save(); // Lưu thay đổi
          var state = { status: 'success', message: 'Change password successful' }
        }
        if (state.status == "success") {
          // req.session.loggedIn = true;
          if (req.session.role == "admin" || req.session.role == "manager") {
            // req.session.isAdmin = true;
            //TODO: xử lý cả cho manager không có staff acceess , hint tạo page mặc định cho từng layout
            var goto = '/admin/staff'
          }
          else {

            var goto = '/home/order'

          }
        }
        var state = { status: state.status, message: state.message, redirect: goto }

        // Các xử lý khác sau khi đăng nhập thành công
        // Đăng nhập thành công, tạo flash message
        req.session.flash = {
          type: state.status,
          intro: 'login feature',
          message: state.message,
        };
        res.json(state)
        //TODO: sửa lại thay vì redirect dùng fetch api hiển thị flash
      }
    } catch (error) {

      next(error);
    }
  }
  async changePassword(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        var err_msg = "";
        var list_err = errors.array();
        list_err.forEach(err => {
          err_msg += err.msg + " , ";
        });

        console.log(err_msg);

        //CƠ CHẾ CỦA VALIDATOR KHÔNG CHO ĐI TIẾP
        var state = { status: 'warning', message: err_msg };
        res.json({ changed: false, status: state.status, message: state.message });
      }
      else {
        const { currpass, newpass, renewpass } = req.body;
        console.log(currpass, newpass, renewpass);

        const find = await User.findById(req.session.account);
        if (!find) {
          var state = { status: 'warning', message: 'Account not found' }
        }
        else {
          var check_password = await bcrypt.compare(currpass, find.password);
          if (check_password) {
            const newpassword = await bcrypt.hash(newpass, parseInt(process.env.BCRYPT_SALT_ROUND));
            find.password = newpassword;
            await find.save(); // Lưu thay đổi
            var state = { status: 'success', message: 'Change password successful' }
          } else {
            var state = { status: 'warning', message: 'Invalid password' }
          }
          // Các xử lý khác sau khi đăng nhập thành công
          // Đăng nhập thành công, tạo flash message
          req.session.flash = {
            type: state.status,
            intro: 'change pass feature',
            message: state.message,
          };
          console.log(req.session.flash);

          res.json({ status: state.status, message: state.message });
        }
      }



    } catch (error) {

      next(error);
    }
  }



  async getProfilebyId(req, res, next) {
    try {
      const accountId = req.params.id;
      const find = await User.findById(accountId);
      if (!find) {
        var state = { status: 'warning', message: 'Account not found' }
      }
      else {
        var check_password = await bcrypt.compare(currpass, find.password);
        if (check_password) {
          const newpassword = await bcrypt.hash(newpass, parseInt(process.env.BCRYPT_SALT_ROUND));
          find.password = newpassword;
          await find.save(); // Lưu thay đổi
          var state = { status: 'success', message: 'Change password successful' }
        } else {
          var state = { status: 'warning', message: 'Invalid password' }
        }
        // Các xử lý khác sau khi đăng nhập thành công
        // Đăng nhập thành công, tạo flash message
        req.session.flash = {
          type: state.status,
          intro: 'change pass feature',
          message: state.message,
        };
        console.log(req.session.flash);

        res.json({ status: state.status, message: state.message });
      }




    } catch (error) {

      next(error);
    }
  }

  async logout(req, res) {
    console.log("LOGOUT : ")
    try {
      if (req.session.loggedIn) {
        req.session.loggedIn = false;
        var state = { status: 'success', message: 'Đã đăng xuất' };
      }
      else {
        var state = { status: 'warning', message: 'Có lỗi xảy ra hãy đăng nhập lại' };
      }

      req.session.flash = {
        type: state.status,
        intro: 'logout feature',
        message: state.message,
      };
      var goto = "/login"
      var flashMessage = req.session.flash;
      // console.log(flashMessage);
      // Trả về phản hồi thành công
      return res.status(200).json({ flashMessage: flashMessage, redirect: goto });
      //   var state = { status: 'warning', message: err_msg };



    } catch (error) {

      next(error);
    }
  }

}

module.exports = new UserController();