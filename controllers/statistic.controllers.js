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
            const startDate = moment(startDay).startOf('day').toDate();
            const endDate = moment(endDay).endOf('day').toDate();

            console.log(startDate + " - " + endDate)

            const orders = await Transaction.find({
                transactionDate: { $gte: startDate, $lte: endDate }
            }).populate({
                path: 'userId',
                select: 'fullName'
            }).populate({
                path: 'courseIds',
                select: 'courseName coursePrice'
            });

            return orders;
        } catch (error) {
            throw error;
        }
    }
    
    
}

module.exports = new StatisticalController();
