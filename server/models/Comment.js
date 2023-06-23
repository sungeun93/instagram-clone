const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    // 댓글 내용
    content: {type: String},
    // 댓글을 단 게시물
    article: {type: Schema.ObjectId, required: true},
    // 댓글 작성자
    author: {type: Schema.ObjectId, required: true, ref: 'User'},
    // 댓글 작성일
    created: {type: Date, default: Date.now},
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

module.exports = mongoose.model('Comment', commentSchema);

