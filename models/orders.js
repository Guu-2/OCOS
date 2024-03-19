const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    //khóa liên kết
    customerID: { type: Schema.Types.ObjectId, ref: 'Customer' },
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String , required: true },
        quantity: { type: Number , required: true },
        price: { type: Number , required: true }
    }],
    totalPrice: { type: Number, required: true },
    amountPaid: { type: Number, required: true},
    change: { type: Number, required: true },
    // paymentInfo: Object,
    createdAt: { type: String, default: new Date().toUTCString() }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
