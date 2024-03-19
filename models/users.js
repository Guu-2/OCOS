const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    fullName: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager','staff'], required: true },
    access: [
        {
          access: { type: String, required: true },
          icon: { type: String, required: true }
        },
    ],
    profilePicture: { type: String, required: true},
    status: { type: String, enum: ['active', 'inactive','intial'], required: true},
    lastLogin: { type: String , required: true},
    createdAt: { type: String, default: new Date().toUTCString()},
    lock: { type: Boolean, default: false},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
