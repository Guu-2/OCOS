const Customer = require('../models/customers');
const Order = require('../models/course');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mailer = require('../utils/mailer')
const moment = require('moment');

var { authentication, isAdmin } = require('../middleware/authentication');
const sendEmail = require('./sendEmail');
const { validate } = require('./validator');

const { validationResult } = require('express-validator');
const { stat } = require('fs');

// const customerData = new Customer({
//     fullName: "John Doe",
//     phone: "123456789",
//     address: "123 Main St, City",
//     createdAt: new Date(),
//     history: ["Order 1", "Order 2", "Order 3"]
// });

// customerData.save()

class CustomerController {

    async getlistcustomer(){
        try {
            const find = await Customer.find({});
            // console.log(find);
            return find
          } catch (error) {
            console.log(error);
          }
    }

    async getCustomerbyId(id) {
        console.log("curr Customer : ")
        try {
            // console.log(phone.toString())
            
            const find = await Customer.findById(id);
            if (find) {
                return find
            }
            return "";

        } catch (error) {

            console.log(error)
        }
    }

    async getHistoryPurchasebyId(id){
        console.log("History order of Customer : ")
        try {

            const orders = await Order.find({ customerID: id })            
            if (orders) {
                return orders
            }
            return "";

        } catch (error) {

            console.log(error)
        }
    }

    async getCustomerbyPhone(req, res, next) {
        console.log("curr Customer : ")
        try {
            const phone = req.params.phone
            console.log(phone.toString())
            const find = await Customer.findOne({ phone: phone.toString() });
            if (find) {
                req.session.customer = find._id.toString()
                res.json({ find: true, status: "success", message: "Customer exist", customer: find })
            }
            else {
                res.json({ find: false, status: "warning", message: "Customer not exist please provide infomation", customer: "" })
            }
        } catch (error) {

            next(error)
        }
    }

    async checkCustomerbyPhone(phone) {
        console.log("curr Customer : ")
        try {
            console.log(phone.toString())
            const find = await Customer.findOne({ phone: phone.toString() });
            if (find) {
                return find._id.toString();
            }
            return "";

        } catch (error) {

            console.log(error)
        }
    }

    async autoCreateCustomer(customer_data) {
        const { phone, fullname, address } = customer_data;
        console.log(phone, fullname, address);
        try {
          const newCustomer = new Customer({
            fullName: fullname,
            phone: phone,
            address: address,
          });
          await newCustomer.save();
          return newCustomer._id.toString();
        } catch (error) {
          console.log(error);
          return "";
        }
      }





}
module.exports = new CustomerController();
