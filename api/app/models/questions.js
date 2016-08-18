var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
questionsSchema =  new Schema({  
question:{ type: String, unique: true },
answer:Object,
//users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User',refPath: 'questions' }],
//users: { type: mongoose.Schema.Types.Relationship, ref: 'User', refPath: 'questions' },
add_date:Date
});
/*questionsSchema.virtual('users', {
  ref: 'User', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'questions' // is equal to `foreignField`
});*/

questionsSchema.pre('save', function(next){
  now = new Date();
  this.last_edit = now;
  if ( !this.add_date ) {
    this.add_date = now;
  }
  next();
});
var questions = mongoose.model('questions',questionsSchema);
module.exports = questions;