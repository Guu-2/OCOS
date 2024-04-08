var express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controllers');
const courseController = require('../controllers/course.controllers');
const orderController = require('../controllers/order.controller')
const customerController = require('../controllers/customer.controllers');
const statisticControllers = require('../controllers/statistic.controllers')
const { validate } = require('../controllers/validator');
const { check } = require('express-validator');

//TODO: Tạo page mặc định cho role student
router.get('/', function (req, res) {
  res.redirect('/home/course');
})
  .get('/course', async function (req, res, next) {
    const partial = 'partials/course';
    const layout = 'layouts/main';

    delete req.session.customer;

    req.partial_path = partial
    req.layout_path = layout

    req.page_data = {
      listproduct: await courseController.get_list_course(),
    }
    await userController.getpage(req, res, next);
  })
  .get('/course/:courseId', async function (req, res) {
    // const productId = req.params.productId; // Lấy productId từ đường dẫn URL

    // try {
    //     const product = await courseController.getProduct(productId); // Sử dụng Mongoose hoặc phương thức tương tự
    //     if (!product) {
    //         return res.status(404).json({ error: 'Product not found' });
    //     }
    //     console.log("product add: ", product)
    //     res.json(product);
    // } catch (error) {
    //     console.error('Error fetching product:', error);
    //     res.status(500).json({ error: 'Server error' });
    // }
  })

    // Gửi yêu cầu POST đến /home/order khi có id
  // .post('/order', async function (req, res, next) {
  //   if (req.body.id) {
  //       const partial = 'partials/product';
  //       const layout = 'layouts/main';
  //       const endpoint = '/home/intial';
  //       const id = req.body.id;
  //       req.partial_path = partial;
  //       req.layout_path = layout;
  //       req.endpoint = endpoint;

  //       req.page_data = {
  //           product_infor: await courseController.getProduct(id),
  //       };
  //       await userController.getpage(req, res, next);
  //   } else {
  //       const { customerInfo, orderItems, totalPrice, amountPaid, change} = req.body;
  //       // console.log(req.body)
  //       const checkout = await customerController.checkCustomerbyPhone(customerInfo.phone)
  //       var cusId="";
  //       if(checkout){
  //         cusId= checkout
  //       }
  //       else{
  //         cusId = await customerController.autoCreateCustomer(customerInfo);
  //       }
  //       console.log(cusId)
  //       //TODO: check custom tạo mới hoặc lấy id để đưa vô
  //       // const cusId = '6574c9e7add981e50025a91c';

  //       req.customer_id = cusId;
  //       req.order_items = orderItems;
  //       req.total_price = totalPrice;
  //       req.amount_paid = amountPaid;
  //       req.change = change;



  //       orderController.addNewOrder(req, res, next);
  //   }
  // })

  .get('/subscribed',async function (req, res, next) {
    const partial = 'partials/my_course';
    const layout = 'layouts/main';

    req.partial_path = partial
    req.layout_path = layout

    await userController.getpage(req, res, next);
  })

  .get('/exercise',async function (req, res, next) {
    const partial = 'partials/exercise';
    const layout = 'layouts/main';

    req.partial_path = partial
    req.layout_path = layout

    await userController.getpage(req, res, next);
  })
  // .post('/statistical', async function (req, res, next) {
  //   const timeFixed = req.body.timeFixed;
  //   const fromDay = req.body.fromDay;
  //   const toDay = req.body.toDay;
  //   let endDay = new Date(); // Lấy ngày hiện tại
  //   let startDay = new Date(); // Khởi tạo ngày bắt đầu

  //   if (timeFixed != undefined) {
  //     switch(timeFixed) {
  //       case "today":
  //         break;
  //       case 'yesterday':
  //           startDay.setDate(endDay.getDate() - 1);
  //           endDay.setDate(endDay.getDate() - 1);
  //           break;
  //       case '7days':
  //           startDay.setDate(endDay.getDate() - 7);
  //           break;
  //       case 'thisMonth':
  //           startDay = new Date(endDay.getFullYear(), endDay.getMonth(), 1);
  //           break;
  //       default:
  //     }
  //   }

  //   if(fromDay != undefined && toDay != undefined) {
  //     startDay = new Date(fromDay);
  //     endDay = new Date(toDay);
  //   }

  //   // Chuyển đổi startDay và endDay thành chuỗi ngày tháng năm
  //   const startDayString = `${startDay.getDate().toString().padStart(2, '0')}-${(startDay.getMonth() + 1).toString().padStart(2, '0')}-${startDay.getFullYear()}`;
  //   const endDayString = `${endDay.getDate().toString().padStart(2, '0')}-${(endDay.getMonth() + 1).toString().padStart(2, '0')}-${endDay.getFullYear()}`;

  //   const partial = 'partials/statistical';
  //   const layout = 'layouts/main';
  //   const endpoint = '/home/intial';
  //   req.partial_path = partial
  //   req.layout_path = layout
  //   req.endpoint = endpoint
    
  //   req.layout_path = layout;
  //   req.page_data = {
  //     start: startDayString,
  //     end: endDayString,
  //     listOrder: await statisticControllers.getByTime(startDay, endDay)
  // };
  //   await userController.getpage(req, res, next);
  // })

  // .post('/bill' , async function(req, res , next) {
  //   const {customerInfo,  orderItems, totalPrice ,amountPaid , change } = req.body;
  //   console.log(customerInfo , orderItems , totalPrice , amountPaid , change);


  //   req.page_data = {
  //     fullname: customerInfo.fullname,
  //     date: new Date().toUTCString(),
  //     product: orderItems,
  //     totalPrice: totalPrice,
  //     amountPaid: amountPaid,
  //     change: change
  //   };


  //   res.json(req.page_data)

  // })

  // .get('/search/:term' , courseController.getproductbyTermRegex)
  // .get('/check_customer/:phone' , customerController.getCustomerbyPhone)
  // .get('/intial', async function (req, res, next) {
  //   const verifyaccess = await userController.verifyAccess(req.session.account);
  //   if (!verifyaccess) {
  //     const feature = req.session.staff_feature;
  //     const sidebar = req.session.access;
  //     const account = await userController.getAccount(req.session.account)
  //     const data_render = req.page_data ? req.page_data : "";
  //     // Lấy flash message từ session
  //     var flashMessage = req.session.flash;
  //     console.log(flashMessage);
  //     // Xóa flash message khỏi session
  //     delete req.session.flash;
  //     // // console.log(feature)
  //     // console.log(sidebar);
  //     // // res.json(feature);
  //     if(account.lock){
  //       var state = { status: 'warning', message: 'Account has been locked' };
  //       req.session.flash = {
  //         type: state.status,
  //         intro: 'lock feature',
  //         message: state.message,
  //       };
  //       res.redirect("/login")
  //     }else{
  //       res.render("partials/intial", { layout: 'layouts/main', access: sidebar, account: account, flashMessage, data: data_render });

  //     }
  //   }
  //   else{
  //     next();
  //   }


  // })
  // .post('/intial', validate.validateChangeDefaultPassword(),  userController.changeDefaultPassword);




module.exports = router;
