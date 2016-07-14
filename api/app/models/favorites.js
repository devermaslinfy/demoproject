var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('favorites', new Schema({  
client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client'
 },
user_id:String,
add_date:Date
}));
   