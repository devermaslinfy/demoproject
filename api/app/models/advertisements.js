var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
advertisementSchema = new Schema({  
name:{ type: String, unique: true },
photo:String,
add_date:Date,
last_edit:Date,
category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
}],
hit: Number,
is_deleted: { type: Number, "default":1}
/*category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
 },*/
});
advertisementSchema.pre('save', function(next){
  now = new Date();
  this.last_edit = now;
  if ( !this.add_date ) {
    this.add_date = now;
  }
  next();
});
module.exports = mongoose.model('advertisements',advertisementSchema);