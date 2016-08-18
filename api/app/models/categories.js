var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
categorySchema = new Schema({  
name:{ type: String, unique: true },
image_url:String,
add_date:Date,
last_edit:Date,
status: Number,
show:{ type: Number, "default":1},
is_deleted: { type: Number, "default":0}
/*category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
 },*/
});
categorySchema.pre('save', function(next){
  now = new Date();
  this.last_edit = now;
  if ( !this.add_date ) {
    this.add_date = now;
  }
  next();
});
module.exports = mongoose.model('categories',categorySchema);