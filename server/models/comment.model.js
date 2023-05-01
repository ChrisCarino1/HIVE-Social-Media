const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'This field is required']
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
        required: [true, 'This field is required']
    },
    post_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    }
})

module.exports = mongoose.model("Comment", CommentSchema)