const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    // 좋아요를 누른 유저
    user: {type: Schema.ObjectId, required: true},
    // 좋아요한 게시물
    article: {type: Schema.ObjectId, required: true}
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

module.exports = mongoose.model('Favorite', favoriteSchema)

