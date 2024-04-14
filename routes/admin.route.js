var express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user.controllers');
const statisticControllers = require('../controllers/statistic.controllers');
const courseControllers = require('../controllers/course.controllers');
const orderController = require('../controllers/order.controller');


var { authentication, isAdmin } = require('../middleware/authentication');
const orderControllers = require('../controllers/order.controller')

const { validate } = require('../controllers/validator');
const customerControllers = require('../controllers/customer.controllers');
/* GET admin page. */

//TODO: quay lại tối ưu layout khi hoàn thành

//TODO: Tạo page mặc định cho role admin
//  ( dùng để trả về cho manager vì không phải lúc nào manager cũng có quyền staff)
router.get('/', function (req, res) {
  res.redirect('/admin/student');
})
  //TODO: sửa lại get staff hiển thị toàn bộ user trong database
  //FOR STAFF CONTROLLER
  .get('/student', async function (req, res, next) {
    const partial = 'partials/student_manager';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      liststudent: await userControllers.getliststudent(),
      feature: req.session.admin_feature,
    }
    // console.log(req.page_data.liststaff)
    await userControllers.getpage(req , res, next);
  })
  .get('/student/:id', async function (req, res, next) {
    // const partial = 'partials/student_manager';
    // const layout = 'layouts/main';
    // req.partial_path = partial
    // req.layout_path = layout
    // req.page_data = {
    //   liststaff: await userControllers.getliststudent(),
    //   feature: req.session.admin_feature,
    // }
    // // console.log(req.page_data.liststaff)
    // await userControllers.getpage(req , res, next);
  })
  //TODO: tạo endpoint cho add staff cho trường hợp bình thướng => nâng lên mail service 
  // .post('/staff',validate.validateInfoStaff() ,userControllers.addnewstaff)
  //FOR PRODUCT CONTROLLER
  .get('/instructor', async function (req, res, next) {
    delete req.session.product
    const partial = 'partials/instructor_manager';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      listinstructor: await userControllers.getlistinstructor(),
      // feature: req.session.admin_feature,
    }
    // console.log(req.page_data.listproduct)
    await userControllers.getpage(req , res, next);
  })
  // .post('/product',validate.validateInfoProduct() ,productControllers.addnewproduct)
  .get('/instructor/:id', async function (req, res, next) {
    // // console.log(req.params.id)
    // delete req.session.product
    // req.session.product = req.params.id
    // // console.log(req.session.product)
    // const partial = 'partials/product_manager';
    // const layout = 'layouts/main';
    // req.partial_path = partial
    // req.layout_path = layout
    // req.page_data = {
    //   product_details: await productControllers.getProduct(req.params.id)
    // }
    // console.log(req.page_data.product_details)
    // await userControllers.getpage(req, res, next);

  })
  // .post('/product/:id',productControllers.addnewproduct)
  // .put('/product/:id',authentication,validate.validateInfoProduct(), productControllers.updateproduct)
  // .delete('/product/:id',authentication, productControllers.deleteproduct)
  .get('/course', async function (req, res, next) {
    const partial = 'partials/course_manager';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      listcourse: await courseControllers.get_list_course()
    }
    await userControllers.getpage(req , res, next);
  })
  .get('/course/:id', async function (req, res, next) {
    // const partial = 'partials/history_purchase';
    // const layout = 'layouts/admin';
    // req.partial_path = partial
    // req.layout_path = layout
    // req.page_data = {
    //   customer_taget: await customerControllers.getCustomerbyId(req.params.id),

    //   history_purchase: await customerControllers.getHistoryPurchasebyId(req.params.id)
    // }
    // await userControllers.getpage(req , res, next);
  })
  .delete('/course/:id', courseControllers.delete_course)
  .get('/transaction', async function (req, res, next) {
    const partial = 'partials/transaction';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      listOrder: await orderController.getlistorder()
    }
    await userControllers.getpage(req , res, next);
  })
  .get('/statistical', async function (req, res, next) {
    const partial = 'partials/statistical';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      transactions: await statisticControllers.getlistOrder()
    }
    await userControllers.getpage(req , res, next);
  })
  .post('/statistical', authentication, async function (req, res, next) {
    const timeFixed = req.body.timeFixed;
    const fromDay = req.body.fromDay;
    const toDay = req.body.toDay;
    let endDay = new Date(); // Lấy ngày hiện tại
    let startDay = new Date(); // Khởi tạo ngày bắt đầu
    if (timeFixed != undefined) {
      switch(timeFixed) {
        case "today":
          break;
        case 'yesterday':
            startDay.setDate(endDay.getDate() - 1);
            // endDay.setDate(endDay.getDate() + 1);
            break;
        case '7days':
            startDay.setDate(endDay.getDate() - 7);
            break;
        case 'thisMonth':
            startDay = new Date(endDay.getFullYear(), endDay.getMonth(), 1);
            break;
        default:
      }
    }
    if(fromDay != undefined && toDay != undefined) {
      startDay = new Date(fromDay);
      endDay = new Date(toDay);
    }
    // Chuyển đổi startDay và endDay thành chuỗi ngày tháng năm
    const startDayString = `${startDay.getDate().toString().padStart(2, '0')}-${(startDay.getMonth() + 1).toString().padStart(2, '0')}-${startDay.getFullYear()}`;
    const endDayString = `${endDay.getDate().toString().padStart(2, '0')}-${(endDay.getMonth() + 1).toString().padStart(2, '0')}-${endDay.getFullYear()}`;
    const partial = 'partials/statistical';
    const layout = 'layouts/admin';
    req.partial_path = partial;
    req.layout_path = layout;
    req.page_data = {
      start: startDayString,
      end: endDayString,
      transactions: await statisticControllers.getByTime(startDay, endDay)
  };
    await userControllers.getpage(req, res, next);
  })

module.exports = router;
