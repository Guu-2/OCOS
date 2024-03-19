const Order = require('../models/orders');
const Customer = require('../models/customers');
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

class OrderController {
  async getlistorder() {
    try {
      const find = await Order.find({})
        .populate({
          path: 'customerID', // Tên field chứa thông tin customerID trong Order schema
          select: 'fullName', // Chọn field cần lấy từ bảng Customers
        })
        .populate({
          path: 'products',
          select: 'productName', // Chọn field cần lấy từ bảng Products
        });
      // console.log(find);
      return find
    } catch (error) {
      console.log(error);
    }
  }

  async getTransaction() {
    try {
      const orders = await getTransaction(); // Gọi hàm lấy danh sách đơn hàng

      const customerSet = new Set(); // Sử dụng Set để tránh các khách hàng trùng lặp

      // Lặp qua từng đơn hàng và trích xuất thông tin khách hàng
      orders.forEach(order => {
        if (order.customerID && order.customerID.fullName) {
          customerSet.add(order.customerID.fullName);
        }
      });

      // Chuyển Set về mảng danh sách khách hàng
      const customerList = Array.from(customerSet);
      console.log("customerlist: ", customerList);
      return customerList;
    } catch (error) {
      console.error('Error getting customer list:', error);
      return [];
    }
  }

  async getProductOfOrderById(id) {
    try {
      const order = await Order.findById(id);
      if (order) {
        return order.products;
      }
      return [];

    } catch (error) {
      console.log(error);
      return [];
    }
  }


  async addNewOrder(req, res, next) {
    const orderItems = req.order_items;
    const customerId = req.customer_id;
    const totalPrice = req.total_price;
    const amoutPaid = req.amount_paid;
    const change = req.change;




    const productIds = [];
    const inventory = new Map();
    orderItems.forEach(product => {
      productIds.push(product.productId); // Lưu productId vào mảng productIds
      inventory.set(product.productId, product.quantity);
    });

    console.log("Total Price:", totalPrice);
    console.log("Product IDs:", productIds);

    try {

      const products = orderItems.map(orderItem => ({
        productId: orderItem.productId,
        productName: orderItem.productName,
        quantity: orderItem.quantity,
        price: orderItem.price
      }));

      console.log(products)

      const newOrder = new Order({
        customerID: customerId,
        products: products,
        totalPrice: totalPrice,
        amountPaid: amoutPaid,
        change: change,
      });
      
      // });
      const savedOrder = await newOrder.save();

      // Lấy objId.toString() của order
      const orderId = savedOrder._id.toString();

      // Lưu orderId vào history của customer
      const customer = await Customer.findById(customerId);
      customer.history.push(orderId);
      await customer.save();



      for (const [productId, quantity] of inventory.entries()) {
        const product = await Product.findById(productId);
        if (product) {
          // Cập nhật thuộc tính inOrders của sản phẩm thành true
          product.inventory = product.inventory - quantity;
          await product.save();
        }
      }

      for (const productId of productIds) {
        // Tìm sản phẩm trong database
        const product = await Product.findById(productId);
        if (product) {
          if (product.inventory == 0) {
            // Cập nhật thuộc tính inOrders của sản phẩm thành true
            product.inOrders = false;
            await product.save();
          }
          else {
            product.inOrders = true;
            await product.save();
          }

        }

      }

      req.session.flash = {
        type: 'success',
        intro: 'Add order',
        message: 'Order saved successful',
      };
      res.json({ saved: true, status: "success", message: "Order saved", product: savedOrder });


      // return savedOrder;
    } catch (error) {
      throw error;
    }
  }
}


module.exports = new OrderController();
