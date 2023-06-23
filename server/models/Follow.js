const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const followSchema = new Schema({
  // 팔라워한 유저
  follower: { type: Schema.ObjectId, required: true, ref: 'User' },
  // 팔로워 당한 유저
  following: { type: Schema.ObjectId, required: true, ref: 'User' }
}, { // options
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

module.exports = mongoose.model('Follow', followSchema);

