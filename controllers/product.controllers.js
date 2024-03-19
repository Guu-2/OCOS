const Product = require('../models/products');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const mailer = require('../utils/mailer')
const moment = require('moment');

var { authentication, isAdmin } = require('../middleware/authentication');
const sendEmail = require('./sendEmail');
const { validate } = require('../controllers/validator');

const { validationResult } = require('express-validator');
const fs = require('fs');

class ProductController {
  async getlistproduct() {
    try {
      const find = await Product.find({});
      // console.log(find);
      return find
    } catch (error) {
      console.log(error);
    }
  }
  async getlistOrder(arr) {
    const list = [];
  
    for (const element of arr) {
      try {
        const product = await Product.findById(element.productId);
  
        if (product) {
          const orderItem = {
            productName: product.productName,
            quantity: element.quantity
          };
  
          list.push(orderItem);
        }
      } catch (error) {
        console.log(error);
      }
    }
    console.log(list);
    return list;
  }

  async getProduct(productID) {
    console.log("curr Product : " + productID)
    try {
      const find = await Product.findById(productID);
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
            barcode:"123"
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

  async deleteproduct(req, res, next) {
    console.log("Delete product : ")
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        if(!product.inOrders){
          await product.deleteOne();
          const imagePath = path.join(__dirname, '../uploads', product.productPicture);
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
            message: "Delete product successfully",
          };
          res.json({ delete: true, status: "success", message: 'Product has been deleted', redirect: "/admin/product" });
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


  async  getproductbyTermRegex(req, res, next) {
    try {
      const term = req.params.term;
      const regex = new RegExp(term, 'i');
      console.log(regex);
      
      let listProduct;
      if (term === "all") {
        listProduct = await Product.find();
      } else {
        listProduct = await Product.find({
          $or: [
            { productName: regex },
            { barcode: regex }
          ]
        });
      }
  
      if (listProduct.length > 0) {
        res.json({ match: true, status: "success", message: 'Success', data: listProduct });
      } else {
        res.json({ match: false, status: "warning", message: 'Fail' });
      }
  
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }
  


}
module.exports = new ProductController();
