const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    fullName: { type: String, required: true },
    role: { type: String, enum: ['admin', 'student','instructor'], required: true },
    access: [
        {
          access: { type: String, required: true },
          icon: { type: String, required: true }
        },
    ],
    cart: { type: [String]},
    subscribed: { type: [String]},
    exercise: { type: [String]},
    note: { type: [String]},
    
    profilePicture: { type: String, required: true},
    lastLogin: { type: String , required: true},
    createdAt: { type: String, default: new Date().toUTCString()},
    lock: { type: Boolean, default: false},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
