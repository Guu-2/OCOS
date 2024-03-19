const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    fullName: { type: String, required: true },
    phone: {type: String, unique: true },
    address: String,
    createdAt: { type: String, default: new Date().toUTCString()  },
    history: { type: [String], default: [] }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
