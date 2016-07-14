var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var hooks = require('hooks');

// set up a mongoose model and pass it using module.exports
/*userSchema = mongoose.model('User', new Schema({ 
    email: { type: String, unique: true }, 
    name: String,
    password: String,
    avtar: String,
    age: Number,
    questions: Object,
    add_date: Date,
    last_login: Date,
    last_edit: Date, 
    login_type: Number,
    status: Number 
}));*/
var userSchema = new Schema({
    email: { type: String, unique: true }, 
    name: String,
    password: String,
    avtar: String,
    age: Number,
    questions: Object,
    add_date: Date,
    last_login: Date,
    last_edit: Date, 
    login_type: Number,
    status: Number 
});

userSchema.pre('save', function(next){
  now = new Date();
  this.last_edit = now;
  if ( !this.add_date ) {
    this.add_date = now;
  }
  next();
});
module.exports = mongoose.model('User',userSchema);