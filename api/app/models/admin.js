var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('admin', new Schema({ 
    email: { type: String, unique: true }, 
    name: String,
    password: String,
    avtar: String,
    age: Number,
    add_date: Date,
    last_login: Date,
    last_edit: Date, 
    login_type: Number,
    admin_type: Number,
    status: Number 
}));
