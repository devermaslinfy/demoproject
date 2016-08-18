var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
clientSchema =  new Schema({ 
//category :Object,
category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
 },
name :String,
image_url :String,
business_type :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business_types'
 },
description : String,
latitude : String,
longitute : String,
Location : Object,
address : Object,
phone : Object,
//zip : String,
status : Number,
add_date : Date,
last_edit : Date
});

clientSchema.pre('save', function(next){
  now = new Date();
  this.last_edit = now;
  if ( !this.add_date ) {
    this.add_date = now;
  }
  next();
});
module.exports = mongoose.model('client',clientSchema);