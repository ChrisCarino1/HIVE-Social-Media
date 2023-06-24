const mongoose = require('mongoose')

const FollowSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    followed_user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
})

module.exports = mongoose.model("Follow", FollowSchema)