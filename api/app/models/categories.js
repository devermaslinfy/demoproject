var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('categories', new Schema({  
name:{ type: String, unique: true },
image_url:String,
add_date:Date,
status: Number
/*category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
 },*/
}));