var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('questions', new Schema({  
question:{ type: String, unique: true },
answer:Object,
add_date:Date
}));