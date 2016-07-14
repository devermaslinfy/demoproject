var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('client', new Schema({ 
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
description :String,
Location :Object,
address :Object,
phone: String,
add_date:Date,
status :Number
}));
