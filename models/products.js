
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName: { type: String, required: true },
    importPrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    category: { type: String, enum: ['phone', 'accessories'], required: true },
    barcode: { type: String, required: true},
    productPicture: { type: String, required: true },
    inventory: {type: Number, required: true},
    createdAt: { type: String, default: new Date().toUTCString() },
    inOrders: { type: Boolean, default: false }
});

productSchema.pre('save', function (next) {
    this.productPicture = this._id + '@product.png';
    this.barcode = this._id.toString();
    next();
});



const Product = mongoose.model('Product', productSchema);

// Xuất model Product để sử dụng cho các .js khác
module.exports = Product;