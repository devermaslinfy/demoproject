var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
adminSchema = new Schema({ 
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
});

adminSchema.pre('save', function(next){
  now = new Date();
  this.last_edit = now;
  if ( !this.add_date ) {
    this.add_date = now;
  }
  next();
});
module.exports = mongoose.model('admin',adminSchema);
