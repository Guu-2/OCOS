var express = require('express');
const router = express.Router();
const User = require('../models/users');
const Course = require('../models/courses');
const Exercise = require('../models/exercises');
const Review = require('../models/reviews');
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
  .get('/courseedit/:courseId', async function (req, res, next) {
    console.log(req.params.courseId)
    const partial = 'partials/edit_course';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      courseId: req.params.courseId,
      course_detail: await courseController.getCourse(req.params.courseId),
      section_detail: await courseController.getSectionsAndLectures(req.params.courseId)
    }
    // console.log(req.page_data.account_details)
    await userController.getpage(req, res, next);

  })
  .put('/courseedit/:courseId', upload.single('courseImage'), async (req, res, next) => {
    try {
        req.body = JSON.parse(req.body.courseData);
        const result = await courseController.editCourse(req, res, next);
        res.json(result);
    } catch (error) {
        next(error);
    }
  })
  .get('/course/:courseId', async function (req, res, next) {
    const user = await User.findById(req.session.account);
    const hasBought = user.subscribed.includes(req.params.courseId);
    const hasAddToCart = user.cart.includes(req.params.courseId);
    const hasReviewsOfACourse = await Review.find({ courseId: req.params.courseId })
    .populate('userId', 'fullName profilePicture'); 
    const hasReviewed = await Review.findOne({ courseId: req.params.courseId, userId: req.session.account })
    .populate('userId', 'fullName profilePicture');
    const hasExercises = await Exercise.find({ courseId: req.params.courseId });

    console.log(req.params.courseId)
    const partial = 'partials/course_detail';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      course_detail: await courseController.getCourse(req.params.courseId),
      hasBought: hasBought,
      hasAddToCart: hasAddToCart,
      hasReviewed: hasReviewed,
      hasReviewsOfACourse: hasReviewsOfACourse,
      hasExercises: hasExercises
    }
    // console.log(req.page_data.account_details)
    await userController.getpage(req, res, next);

  })
  .delete('/course/:courseId', courseController.delete_course)
  .get('/exercise', async function (req, res, next) {
    const partial = 'partials/exercise';
    const layout = 'layouts/main';
  
    const coursesWithExercises = await courseController.getCoursesWithExercises(req, res, next);
    console.log("Courses with exercises: ", coursesWithExercises);
  
    req.partial_path = partial;
    req.layout_path = layout;
  
    req.page_data = {
      list_my_course: coursesWithExercises,
      list_all_course_of_anInstructor: await courseController.get_my_course(req, res, next)
    }
    await userController.getpage(req, res, next);
  })
  .post('/course/exercise', async (req, res, next) => {
    await courseController.manageExercise(req, res, next);
  })
  .get('/exercise', async function (req, res, next) {
    const partial = 'partials/exercise';
    const layout = 'layouts/main';
  
    const coursesWithExercises = await courseController.getCoursesWithExercises(req, res, next);
    console.log("Courses with exercises: ", coursesWithExercises);
  
    req.partial_path = partial;
    req.layout_path = layout;
  
    req.page_data = {
      list_my_course: coursesWithExercises,
      list_all_course_of_anInstructor: await courseController.get_my_course(req, res, next)
    }
    await userController.getpage(req, res, next);
  })
  .post('/course/exercise', async (req, res, next) => {
    await courseController.manageExercise(req, res, next);
  })
  .delete('/course/:courseId', courseController.delete_course)
  .get('/exercise', async function (req, res, next) {
    const partial = 'partials/exercise';
    const layout = 'layouts/main';
  
    const coursesWithExercises = await courseController.getCoursesWithExercises(req, res, next);
    console.log("Courses with exercises: ", coursesWithExercises);
  
    req.partial_path = partial;
    req.layout_path = layout;
  
    req.page_data = {
      list_my_course: coursesWithExercises,
      list_all_course_of_anInstructor: await courseController.get_my_course(req, res, next)
    }
    await userController.getpage(req, res, next);
  })
  .post('/course/exercise', async (req, res, next) => {
    await courseController.manageExercise(req, res, next);
  })
  .get('/exercise', async function (req, res, next) {
    const partial = 'partials/exercise';
    const layout = 'layouts/main';
  
    const coursesWithExercises = await courseController.getCoursesWithExercises(req, res, next);
    console.log("Courses with exercises: ", coursesWithExercises);
  
    req.partial_path = partial;
    req.layout_path = layout;
  
    req.page_data = {
      list_my_course: coursesWithExercises,
      list_all_course_of_anInstructor: await courseController.get_my_course(req, res, next)
    }
    await userController.getpage(req, res, next);
  })
  .post('/course/exercise', async (req, res, next) => {
    await courseController.manageExercise(req, res, next);
  })
  .get('/rating', async function (req, res, next) {
    const user = await User.findById(req.session.account);
    const hasBought = user.subscribed.includes(req.params.courseId);
    const hasAddToCart = user.cart.includes(req.params.courseId);

    const hasReviewsOfACourse = await Review.find({ courseId: req.params.courseId })
    .populate('userId', 'fullName'); 

    const hasReviewed = await Review.findOne({ courseId: req.params.courseId, userId: req.session.account })
    .populate('userId', 'fullName');

    const partial = 'partials/course_detail';
    const layout = 'layouts/main';
    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      course_detail: await courseController.getCourse(req.params.courseId),
      hasBought: hasBought,
      hasAddToCart: hasAddToCart,
      hasReviewed: hasReviewed,
      hasReviewsOfACourse: hasReviewsOfACourse
    }
    await userController.getpage(req, res, next);
  })
  .post('/rating', async function(req, res) {
      const courseId = req.body.courseId;
      try {
        await courseController.addRatingAndComment(req, res, courseId);
      } catch (error) {
          res.status(500).json({ message: 'Error while adding rating and comment!!' });
      }
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
      notes: await courseController.getNotesByUserAndCourseID(req)
    }
    // console.log(req.page_data.account_details)
    await userController.getpage(req, res, next);
  })
  .get('/notes', async (req, res) => {
    const notes = await courseController.getNotesByUserAndCourseID(req);
    res.json(notes);
  })
  .post('/take-note', async function (req, res, next) {
    try {
      const added = await courseController.addNewNote(req, res);
      
      res.json(added);

    } catch (error) {
      // Xử lý lỗi (nếu có)
      console.error("Error:", error);
      next(error);
    }
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

  .get('/subscribed', async function (req, res, next) {
    const partial = 'partials/my_course';
    const layout = 'layouts/main';

    req.partial_path = partial
    req.layout_path = layout
    req.page_data = {
      list_my_course: await courseController.get_subcribe_course(req, res, next),
    }
    await userController.getpage(req, res, next);
  })

  .get('/exercise', async function (req, res, next) {
    const partial = 'partials/exercise';
    const layout = 'layouts/main';

    req.partial_path = partial
    req.layout_path = layout

    await userController.getpage(req, res, next);
  })
  .get('/search/:term' , courseController.getcoursebyTermRegex)

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
