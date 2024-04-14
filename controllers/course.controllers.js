
const Course = require('../models/courses');
const Section = require('../models/section');
const Lecture = require('../models/lecture');
const Review = require('../models/reviews');
const Note = require('../models/note');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const mailer = require('../utils/mailer')
const moment = require('moment');

var { authentication, isAdmin } = require('../middleware/authentication');
const sendEmail = require('./sendEmail');
const { validate } = require('./validator');

const { validationResult } = require('express-validator');
const fs = require('fs');

class CourseController {
  async get_list_course() {
    try {
      const courses = await Course.find().populate('instructorID', 'profilePicture fullName');
      for (const course of courses) {
        const instructor = course.instructorID; // Người hướng dẫn tương ứng với khóa học
        const profilePicture = instructor.profilePicture; // Ảnh đại diện của người hướng dẫn
        const fullName = instructor.fullName; // Tên đầy đủ của người hướng dẫn

        // console.log(profilePicture, fullName);
      }
      return courses;
    } catch (error) {
      return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách khóa học.' });
    }
  }

  async get_my_course(req, res, next) {
    try {
      const instructorID = req.session.account; // Lấy instructorID từ session hoặc nguồn dữ liệu khác

      console.log(instructorID); // Xử lý kết quả tìm kiếm
      const courses = await Course.find({ instructorID }).populate('instructorID', 'profilePicture fullName');

      for (const course of courses) {
        const instructor = course.instructorID; // Người hướng dẫn tương ứng với khóa học
        const profilePicture = instructor.profilePicture; // Ảnh đại diện của người hướng dẫn
        const fullName = instructor.fullName; // Tên đầy đủ của người hướng dẫn

        // console.log(profilePicture, fullName);
      }

      return courses;
    } catch (error) {
      next(error);
    }
  }

  async  get_subcribe_course(req, res, next) {
    try {
      const studentID = req.session.account; // Lấy studentID từ session hoặc nguồn dữ liệu khác
    
      const student = await User.findById(studentID); // Lấy thông tin người dùng từ bảng User
      console.log(student)
      const courses = await Course.find({ _id: { $in: student.subscribed } }).populate('instructorID', 'profilePicture fullName'); // Lấy thông tin các khóa học đã đăng ký từ bảng Course và liên kết với thông tin người dùng từ bảng User
      console.log(courses)
      // const subscribedCourses = courses.map(course => {
      //   const { courseName, coursePrice, courseCategory, coursePreview, courseImage, courseDescription, courseAudience, courseResult, courseRequirement } = course;
    
      //   return {
      //     instructorID: course.instructorID,
      //     courseName,
      //     coursePrice,
      //     courseCategory,
      //     coursePreview,
      //     courseImage,
      //     courseDescription,
      //     courseAudience,
      //     courseResult,
      //     courseRequirement,
      //     fullName: course.instructorID.fullName,
      //     profilePicture: course.instructorID.profilePicture
      //   };
      // });
    
      // const result = {
      //   student: {
      //     fullName: student.fullName,
      //     profilePicture: student.profilePicture
      //   },
      //   courses: subscribedCourses
      // };
    
      return courses;
    } catch (error) {
      next(error);
    }
  }
  

  async delete_course(req, res, next) {
    console.log("Delete course : ")
    try {
      const product = await Course.findById(req.params.courseId);
      if (product) {
        if(!product.inOrders){
          await product.deleteOne();
          const imagePath = path.join(__dirname, '../uploads', product.courseImage);
          console.log(imagePath);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Có lỗi xảy ra khi xóa file:', err);
              return;
            }
            console.log('File đã được xóa thành công.');
          });
          req.session.flash = {
            type: "success",
            intro: 'Delete product',
            message: "Delete course successfully",
          };
          res.json({ delete: true, status: "success", message: 'Course has been deleted', redirect: "/admin/course" });
        }
        else{
          res.json({ delete : false, status: "warning", message: 'Product is in order'});
        }

      } else {
        res.status(404)({ delete: false, status: "success", message: 'Product Not Foud' });
      }
    } catch (err) {
      next(err);
    }
  }


  async getcoursebyTermRegex(req, res, next) {
    try {
      const term = req.params.term;
      const regex = new RegExp(term, 'i');
      console.log(regex);

      let listCourse;
      if (term === "all") {
        listCourse = await Course.find().populate('instructorID', 'profilePicture fullName')
      } else {
        listCourse = await Course.find({
          $or: [
            { courseName: regex },
          ]
        }).populate('instructorID', 'profilePicture fullName');
      }

      if (listCourse.length > 0) {
        res.json({ match: true, status: "success", message: 'Success', data: listCourse });
      } else {
        res.json({ match: false, status: "warning", message: 'Fail', data: listCourse});
      }

    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  

  async getCourse(courseID) {
    console.log("curr Course : " + courseID);
    try {
      const find = await Course.findById(courseID).populate('instructorID', 'fullName');
      // console.log(find)
      if (find) {
        return find;
      } else {
        return "";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getSectionsAndLectures(courseID) {
    try {
      const sections = await Section.find({ courseID });

      const formattedSections = [];

      for (const section of sections) {
        const lectures = await Lecture.find({ sectionID: section._id });

        const formattedLectures = lectures.map(lecture => ({
          lectureID: lecture._id,
          lectureTitle: lecture.lectureTitle,
          lectureLink: lecture.lectureLink,
          lectureDescription: lecture.lectureDescription
        }));

        formattedSections.push({
          sectionNumber: section.sectionNumber,
          sectionTitle: section.sectionTitle,
          lectures: formattedLectures
        });
      }
      return formattedSections;
    } catch (error) {
      console.log(error);
      return null; // Hoặc giá trị mặc định khác tùy thuộc vào yêu cầu của bạn
    }
  }


  async getFirstlecture(courseID) {
    try {
      const sections = await Section.find({ courseID });

      if (sections.length === 0) {
        return null; // Không có phần (section) nào được tìm thấy
      }

      const firstSection = sections[0];
      const lectures = await Lecture.find({ sectionID: firstSection._id });

      if (lectures.length === 0) {
        return null; // Không có bài giảng (lecture) nào được tìm thấy trong phần đầu tiên
      }

      const firstLecture = lectures[0];

      const formattedSection = {
        sectionNumber: firstSection.sectionNumber,
        sectionTitle: firstSection.sectionTitle,
        lectureID: firstLecture._id,
        lectureTitle: firstLecture.lectureTitle,
        lectureLink: firstLecture.lectureLink,
        lectureDescription: firstLecture.lectureDescription

      };
      console.log(formattedSection);

      return formattedSection;
    } catch (error) {
      console.log(error);
      return null; // Hoặc giá trị mặc định khác tùy thuộc vào yêu cầu của bạn
    }
  }

  async add_to_cart(req, res, next) {
    try {
      const userID = req.session.account; // ID của người dùng từ req.session.account
      const { courseId, del_courseId } = req.body;
      console.log(courseId, del_courseId)
      if (courseId) {
        // Kiểm tra xem khóa học đã tồn tại trong giỏ hàng của người dùng hay chưa
        const user = await User.findOne({
          _id: userID,
          cart: { $in: [courseId] }
        });

        if (user) {
          // Khóa học đã tồn tại trong giỏ hàng
          return res.json({ status: "success", message: "Khóa học đã tồn tại trong giỏ hàng" });
        }

        // Cập nhật cart của người dùng
        const updatedUser = await User.findOneAndUpdate(
          { _id: userID }, // Tìm người dùng dựa trên ID
          { $push: { cart: courseId } }, // Thêm courseId vào cart
          { new: true } // Trả về người dùng đã được cập nhật
        );

        console.log(updatedUser); // In thông tin người dùng đã được cập nhật

        // Thực hiện các xử lý khác sau khi thêm vào giỏ hàng thành công

        // Gửi phản hồi thành công về client
        return res.json({ status: "success", message: "Thêm vào giỏ hàng thành công" });
      }

      else if (del_courseId) {
        // Xóa khóa học khỏi giỏ hàng
        const user = await User.findOneAndUpdate(
          { _id: userID }, // Tìm người dùng dựa trên ID
          { $pull: { cart: del_courseId } }, // Xóa del_courseId khỏi cart
          { new: true } // Trả về người dùng đã được cập nhật
        );

        console.log(user); // In thông tin người dùng đã được cập nhật

        // Thực hiện các xử lý khác sau khi xóa khỏi giỏ hàng thành công
        req.session.flash = {
          type: 'success',
          intro: 'del cart',
          message: 'Delete successful',
        };
        // Gửi phản hồi thành công về client
        return res.json({ status: "success", message: "Xóa khỏi giỏ hàng thành công" });
      } else {
        // Nếu không có courseId hoặc del_courseId được cung cấp
        return res.json({ status: "error", message: "Không có khóa học hoặc ID khóa học để xử lý" });
      }
    } catch (error) {
      // Xử lý lỗi (nếu có)
      console.error("Error:", error);
      // Gửi phản hồi lỗi về client
      res.status(500).json({ status: "error", message: "Đã xảy ra lỗi khi xử lý giỏ hàng" });
    }
  }
  async get_list_cart(req, res, next) {
    try {
      const userId = req.session.account; // Lấy userId từ session hoặc nguồn dữ liệu khác

      // Lấy thông tin người dùng và populate mảng cart với các đối tượng course
      const user = await User.findById(userId).populate('cart', 'courseName coursePrice courseCategory');

      if (!user) {
        // Người dùng không tồn tại
        return res.json({ status: 'error', message: 'User does not exist' });
      }

      const cartItems = user.cart; // Mảng cart của người dùng
      const cartCourses = []; // Mảng chứa thông tin course từ cart

      // Lặp qua từng item trong cart và lấy thông tin course tương ứng
      for (const cartItem of cartItems) {
        const course = await Course.findById(cartItem._id).populate('instructorID', 'fullName');
        if (course) {
          const formattedCourse = {
            courseId: course._id.toString(),
            courseName: course.courseName,
            coursePrice: course.coursePrice,
            courseCategory: course.courseCategory,
            courseImage: course.courseImage,
            instructorFullName: course.instructorID.fullName,
            courseImage: course.courseImage
          };
          cartCourses.push(formattedCourse);
        }
      }

      // Gửi phản hồi với danh sách các course trong cart
      return cartCourses;
    } catch (error) {
      // Xử lý lỗi (nếu có)
      console.error('Error:', error);
      // Gửi phản hồi lỗi về client
      res.status(500).json({ status: 'error', message: 'Đã xảy ra lỗi khi lấy danh sách cart' });
    }
  }
  //TODO: thêm flash +  dark mode cho phần product
  async addnewproduct(req, res, next) {
    console.log("ADD new product : ")
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
        res.json({ added: false, status: state.status, message: state.message });
      } else {
        console.log("SUCCESS")
        const { productname, importprice, retailprice, inventory, category } = req.body;
        console.log(productname, importprice, retailprice, inventory, category)


        const find = await Product.findOne({ productName: productname });
        if (!find) {
          // console.log(defaultpassword);
          const newProduct = new Product({
            productName: productname,
            importPrice: parseInt(importprice),
            retailPrice: parseInt(retailprice),
            inventory: inventory,
            category: category,
            productPicture: "../images/default_product.png",
            barcode: "123"
          });

          // res.json({ added: true, status: "success", message: "Add staff successfully" });
          await newProduct.save()
            .then((savedProduct) => {
              console.log('Product saved successfully:');
              const imagePath = path.join(__dirname, '../uploads', 'tmp@product.jpg'); // Đường dẫn của hình ảnh upload

              const newImagePath = path.join(__dirname, '../uploads', savedProduct._id.toString() + "@product.png"); // Đường dẫn mới với tên file tương ứng với productPicture
              console.log(imagePath, newImagePath);
              fs.rename(imagePath, newImagePath, function (err) {
                if (err) {
                  console.error('Error renaming image:', err);
                } else {
                  console.log('Image renamed successfully');
                  req.session.flash = {
                    type: 'success',
                    intro: 'Add product',
                    message: 'Add product successful',
                  };
                  res.json({ added: true, status: "success", message: "Add product successfully", product: savedProduct });
                }
              });

            }).catch((error) => {
              // Xử lý lỗi nếu quá trình lưu không thành công
              console.error('Error saving product:', error);
              res.json({ added: false, status: "warning", message: "Failed to add product" });
            })
        } else {
          // res.json({ added: true, status: "success", message: "Add staff successfully" });
          res.json({ added: false, status: "warning", message: "Product name already exists" });
        }
      }

    } catch (error) {

      next(error);
    }
  }

  async updateproduct(req, res, next) {
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
        res.json({ update: false, status: state.status, message: state.message });
      } else {
        console.log("SUCCESS")
        const { productname, importprice, retailprice, inventory, category } = req.body;
        console.log(productname, importprice, retailprice, inventory, category)

        const find = await Product.findById(req.params.id);
        if (find) {
          // console.log(defaultpassword);

          find.productName = productname,
            find.importPrice = parseInt(importprice),
            find.retailPrice = parseInt(retailprice),
            find.inventory = parseInt(inventory),
            find.category = category,


            // res.json({ added: true, status: "success", message: "Add staff successfully" });
            await find.save()
              .then((savedProduct) => {
                console.log('Product saved successfully:');

                req.session.flash = {
                  type: "success",
                  intro: 'Update product',
                  message: "Update product successfully",
                };
                res.json({ update: true, status: "success", message: "Update product successfully", product: savedProduct });
              }).catch((error) => {
                // Xử lý lỗi nếu quá trình lưu không thành công
                console.error('Error saving product:', error);

                res.json({ update: false, status: "error", message: "Failed to add staff" });
              })
        }
        else {
          // res.json({ added: true, status: "success", message: "Add staff successfully" });
          res.json({ update: false, status: "warning", message: "Product name already exists" });
        }
      }

    } catch (error) {

      next(error);
    }

  }


  // Thêm khóa học
  async addNewCourse(req, res, next) {
    console.log("ADD new course : ");
    try {
      const errors = validationResult(req);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        var err_msg = "";
        var list_err = errors.array();
        list_err.forEach(err => {
          err_msg += err.msg + " , ";
        });

        console.log(err_msg);

        var state = { status: 'warning', message: err_msg };
        res.json({ added: false, status: state.status, message: state.message });
      } else {
        console.log(req.body);
        const { courseName, coursePrice, courseCategory, coursePreview, courseDescription, courseAudience, courseResult, courseRequirement, sections } = req.body;
        var instructorID = req.session.account;
        const newCourse = new Course({
          instructorID,
          courseName,
          coursePrice,
          courseCategory,
          coursePreview,
          courseImage: req.file ? '../../courses/' + req.file.filename : '../images/default_course.jpg',
          courseDescription,
          courseAudience,
          courseResult,
          courseRequirement
        });

        const savedCourse = await newCourse.save();

        for (const section of sections) {
          const newSection = new Section({
            courseID: savedCourse._id,
            sectionNumber: section.sectionNumber,
            sectionTitle: section.sectionTitle
          });

          const savedSection = await newSection.save();

          for (const lecture of section.lectures) {
            const newLecture = new Lecture({
              sectionID: savedSection._id,
              lectureTitle: lecture.lectureTitle,
              lectureLink: lecture.lectureLink,
              lectureDescription: lecture.lectureDescription
            });

            await newLecture.save();
          }
        }

        res.status(201).json({ added: true, status: "success", message: "Course added successfully", course: savedCourse });
      }
    } catch (error) {
      // res.status(500).json(error);
      // console.error("Lỗi: " + error);
      next(error);
    }
  }

  // Take note
  async addNewNote(req, res) {
    try {
      const userID = req.session.account;
      const { lectureID, noteTimeStamp, noteDescription } = req.body;
      
      const newNote = new Note({
          lectureID,
          userID,
          noteTimeStamp,
          noteDescription
      });

      const savedNote = await newNote.save();

      const noteWithDetails = await Note.findById(savedNote._id)
          .populate({
              path: 'lectureID',
              select: 'lectureTitle lectureLink lectureDescription sectionID',
              populate: {
                  path: 'sectionID',
                  select: 'sectionNumber sectionTitle'
              }
          });

        // Check if the note and its details were fetched successfully
        if (!noteWithDetails) {
            throw new Error("Note saved but related details could not be fetched.");
        }
          
        const response = {
          success: true,
          message: "Note added successfully",
          note: {
              id: noteWithDetails.id,
              noteTimeStamp: noteWithDetails.noteTimeStamp,
              noteDescription: noteWithDetails.noteDescription,
              lectureDetails: {
                  lectureTitle: noteWithDetails.lectureID.lectureTitle,
                  lectureLink: noteWithDetails.lectureID.lectureLink,
                  lectureDescription: noteWithDetails.lectureID.lectureDescription
              },
              sectionDetails: {
                  sectionNumber: noteWithDetails.lectureID.sectionID.sectionNumber,
                  sectionTitle: noteWithDetails.lectureID.sectionID.sectionTitle
              }
          }
      };

      // Send the detailed response
      res.status(201).json(response);
    } catch (error) {
        console.error("Error adding note:", error);
        res.status(500).json({ success: false, message: "Failed to add note" });
    }
  }

  async getNotesByUserAndCourseID(req) {
    try {
      const userId = req.session.account; // Lấy userID từ session
      const courseId = req.params.courseId;
  
      // Truy vấn tất cả notes dựa trên userId và courseId
      const notes = await Note.find({ userID: userId })
        .populate({
          path: 'lectureID',
          populate: {
            path: 'sectionID',
            select: 'sectionNumber sectionTitle'
          },
          select: 'lectureTitle lectureLink lectureDescription'
        })
        .exec();
  
      if (!notes) {
        return null;
      }
  
      // Tạo danh sách formatted notes để gửi về client
      const formattedNotes = notes.map(note => {
        const lectureTitle = note.lectureID ? note.lectureID.lectureTitle : 'Lecture Not Found';
        const sectionTitle = note.lectureID && note.lectureID.sectionID ? note.lectureID.sectionID.sectionTitle : 'Section Not Found';
  
        return {
          noteTimeStamp: note.noteTimeStamp,
          noteDescription: note.noteDescription,
          lectureTitle: lectureTitle,
          lectureLink: note.lectureID.lectureLink, 
          lectureDescription: note.lectureID.lectureDescription,
          sectionTitle: sectionTitle,
          lectureID: note.lectureID._id
        };
      });
  
      // Gửi phản hồi với danh sách các note
      return formattedNotes;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async addRatingAndComment(req, res, courseID) {
    const { rmComment } = req.body;
    const userID = req.session.account;
    const { rating, comment } = req.body;
    let review = await Review.findOne({ courseId: courseID, userId: userID });
    try {
      if (courseID) {
        if (review) {
          console.log("existingReview")
          // Người dùng đã đánh giá, cập nhật bình luận và đánh giá hiện tại
          review.rating = rating;
          review.comment = comment;
          await review.save();
        } else {
        console.log("newReview")
          // tạo mới đánh giá và bình luận
            let review = new Review({ 
                userId: userID,
                courseId: courseID,
                rating: req.body.rating,
                comment: req.body.comment
            })
            review.save()
          }

        req.session.flash = {
          type: 'success',
          message: 'Rating and comment added successfully',
        };

        await Course.findByIdAndUpdate(courseID, {
          $push: { reviews: review._id }
        }, { new: true });

        res.json({ status: "success", message: "Rating and comment added successfully" })

      } else if (rmComment) {
        try {
          console.log("delcom")
          const userID = req.session.account;
          const existingReview = await Review.findOneAndDelete({ userId: userID, _id: rmComment });
          console.log("exist", existingReview)
          if (existingReview) {

            // rm trong course
            const user = await Course.findOneAndUpdate(
              { _id: userID },
              { $pull: { reviews: rmComment } }, 
              { new: true }
            );
    
            req.session.flash = {
              type: 'success',
              intro: 'del comment',
              message: 'Delete successful',
            };
            // Gửi phản hồi thành công về client
            return res.json({ status: "success", message: "Rating and comment removed successfully" });
          } else {
            res.json({ status: "warning", message: "Rating and comment not found" });
          }
        } catch(err) {
          req.session.flash = {
            type: 'error',
            intro: 'comment failed',
            message: err.message,
          };
            res.json({ success: false, message: err.message })
        }
        
      } else {
        // Nếu không có courseId hoặc del_courseId được cung cấp
        return res.json({ status: "error", message: "Không có khóa học hoặc ID khóa học để xử lý" });
      }
      } catch(err) {
        req.session.flash = {
          type: 'error',
          intro: 'comment failed',
          message: err.message,
        };
          res.json({ status: "warning", message: err.message })
      }
  }


}
module.exports = new CourseController();
