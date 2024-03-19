const Product = require('../models/products');

const { validationResult } = require('express-validator');

class TransactionController {
  async getlistproduct() {
    try {
      const find = await Product.find({});
      // console.log(find);
      return find
    } catch (error) {
      console.log(error);
    }
  }
  async getProduct(productID) {
    try {
      const find = await Product.findById(productID);
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


  async updateproduct(req,res , next){
    console.log("Update product : ")
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
        const { productname, importprice, retailprice, category } = req.body;
        console.log(productname, importprice, retailprice, category)

        const find = await Product.findById(req.params.id);
        if (find) {
          // console.log(defaultpassword);
  
          find.productName= productname,
          find.importPrice=parseInt(importprice),
          find.retailPrice= parseInt(retailprice),
          find.category = category,
        

          // res.json({ added: true, status: "success", message: "Add staff successfully" });
          await find.save()
            .then((savedProduct) => {
              console.log('Product saved successfully:');

              res.json({ update: true, status: "success", message: "Add staff successfully", product: savedProduct });
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
        await product.deleteOne();
        res.json({ delete: true, status: "success", message: 'Sản phẩm đã được xóa thành công!' , redirect: "/admin/product"});
      } else {
        res.status(404)({ delete: true, status: "success",  message: 'Không tìm thấy sản phẩm!' });
      }
    } catch (err) {
      next(err);
    }
  }


}
module.exports = new ProductController();