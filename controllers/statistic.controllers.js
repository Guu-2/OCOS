const Customer = require('../models/customers');
const Order = require('../models/courses');
const Product = require('../models/products');
const Transaction = require('../models/transactions');

const jwt = require('jsonwebtoken');
const moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class StatisticalController {
    async getlistOrder() {
        try {
            // Xử lý lấy dữ liệu từ cơ sở dữ liệu
            const orders = await Transaction.find()
            .populate({
                path: 'userId',
                select: 'fullName'
            }).populate({
                path: 'courseIds',
                select: 'courseName coursePrice'
            });;
            return orders;
        } catch (error) {
            // next(error);
            throw error;
        }
    }

    
    async getByTime(startDay, endDay) {
        try {
            const startDate = new Date(startDay);
            startDate.setUTCHours(0, 0, 0, 0);

            const endDate = new Date(endDay);
            endDate.setUTCHours(23, 59, 59, 999);

            console.log(startDate.toUTCString() + " - " + endDate.toUTCString())

            const orders = await Transaction.find({
                transactionDate: { $gte: startDate.toUTCString(), $lte: endDate.toUTCString() }
            }).populate({
                path: 'courseIds',
                select: 'courseName coursePrice'
            });

            console.log(orders);

            return orders;
        } catch (error) {
            throw error;
        }
    }
    
    
}

module.exports = new StatisticalController();
