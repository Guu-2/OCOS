var express = require('express');
const router = express.Router();
const User = require('../models/users');
const userController = require('../controllers/user.controllers');
const courseController = require('../controllers/course.controllers');
const orderController = require('../controllers/order.controller')
const customerController = require('../controllers/customer.controllers');
const statisticControllers = require('../controllers/statistic.controllers')
const { validate } = require('../controllers/validator');
const { check } = require('express-validator');
const multer = require('multer');
const path = require('path');
const uploadsFolderPath = path.join(__dirname, '../uploads');

// multer lưu ảnh của khóa học
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsFolderPath + '/courses');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//TODO: Tạo page mặc định cho role student
router.get('/', function (req, res) {
  res.redirect('/home/course');
})
  .get('/course', async function (req, res, next) {
    const partial = 'partials/course';
    const layout = 'layouts/main';

    // delete req.session.customer;
    if (req.session.role == "instructor") {
      res.redirect('/home/course_create');
    } else {
      req.partial_path = partial
      req.layout_path = layout

      req.page_data = {
        listcourse: await courseController.get_list_course(),
      }
      await userController.getpage(req, res, next);
    }

  })
  .get('/course_create', async function (req, res, next) {
    const partial = 'partials/course_create';
    const layout = 'layouts/main';


    req.partial_path = partial
    req.layout_path = layout

    req.page_data = {
      list_my_course: await courseController.get_my_course(req, res, next),
    }
    await userController.getpage(req, res, next);
  })
  .post('/course/create', upload.single('courseImage'), async (req, res, next) => {
    try {
        req.body = JSON.parse(req.body.courseData);
        const result = await courseController.addNewCourse(req, res, next);
        res.json(result);
    } catch (error) {
        next(error);
    }
  })
  .get('/course/:courseId', async function (req, res, next) {
    const user = await User.findById(req.session.account);
    const hasBought = user.subscribed.includes(req.params.courseId);
    const hasAddToCart = user.cart.includes(req.params.courseId);

    console.log(req.params.courseId)
    const partial = 'partials/course_detail';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      course_detail: await courseController.getCourse(req.params.courseId),
      hasBought: hasBought,
      hasAddToCart: hasAddToCart
    }
    // console.log(req.page_data.account_details)
    await userController.getpage(req, res, next);

  })
  .get('/lecture/:courseId', async function (req, res, next) {
    console.log(req.params.courseId)
    const partial = 'partials/lecture';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      menu_bar: await courseController.getSectionsAndLectures(req.params.courseId),
      first_lecture: await courseController.getFirstlecture(req.params.courseId),
    }
    // console.log(req.page_data.account_details)
    await userController.getpage(req, res, next);
  })
  .get('/cart', async function (req, res, next) {
    const partial = 'partials/shopping_cart';
    const layout = 'layouts/main';

    console.log(req.session.account)

    req.partial_path = partial
    req.layout_path = layout

    req.page_data = {
      list_cart: await courseController.get_list_cart(req, res , next),
    }
    await userController.getpage(req, res, next);


  })
  .post('/cart', async function (req, res, next) {
    console.log(req.body);
  
    try {
      // Xử lý logic liên quan đến thêm vào giỏ hàng ở đây
      // Ví dụ:
      // Tiếp tục xử lý các thao tác thêm vào giỏ hàng với courseId
      const added = await courseController.add_to_cart(req, res , next);
      
      res.json(added);
      // Gửi phản hồi thành công về client

    } catch (error) {
      // Xử lý lỗi (nếu có)
      console.error("Error:", error);
      next(error);
      // Gửi phản hồi lỗi về client
      // res.status(500).json({ status: "error", message: "Đã xảy ra lỗi khi thêm vào giỏ hàng" });
    }
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

  .get('/subscribed', async function (req, res, next) {
    const partial = 'partials/my_course';
    const layout = 'layouts/main';

    req.partial_path = partial
    req.layout_path = layout

    await userController.getpage(req, res, next);
  })

  .get('/exercise', async function (req, res, next) {
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
  .get('/about_us', async function (req, res, next) {
    const partial = 'partials/about_us';
    const layout = 'layouts/main';

    delete req.session.customer;

    req.partial_path = partial
    req.layout_path = layout

    await userController.getpage(req, res, next);
  })
  .get('/contact', async function (req, res, next) {
    const partial = 'partials/contact';
    const layout = 'layouts/main';

    delete req.session.customer;

    req.partial_path = partial
    req.layout_path = layout

    await userController.getpage(req, res, next);
  })





module.exports = router;
