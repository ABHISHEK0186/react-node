const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:  'Name is required',
        trim: true
    },
    phone: {
        type: String,
        required: 'Phone is required',
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: 'Email is required',
        
    },
    password: {
        type: String,
        required: 'Password is required',
        trim: true,
        
    },
    Cpassword: {
        type: String,
        required: 'Password is required',
        trim: true,
    
    }
   

}, { timestamps: true });

module.exports = mongoose.model('visio_user', userSchema);