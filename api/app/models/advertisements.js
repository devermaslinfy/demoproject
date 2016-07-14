var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('advertisements', new Schema({  
name:{ type: String, unique: true },
category:[{type: mongoose.Schema.Types.ObjectId, ref: 'categories'}],
photo:String,
hit: Number,
add_date:Date
}));