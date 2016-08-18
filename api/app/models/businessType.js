var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
businessSchema =  new Schema({
name:{ type: String, unique: true },
add_date:Date,
last_edit:Date,
is_deleted: { type: Number, "default":0}
});
businessSchema.pre('save', function(next){
  now = new Date();
  this.last_edit = now;
  if ( !this.add_date ) {
    this.add_date = now;
  }
  next();
});
module.exports = mongoose.model('business_types',businessSchema);