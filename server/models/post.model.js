const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    description:{
        type: String,
        required: [true, 'Text is required for posts'],
        maxLength: [280, 'Post cannot exceed more than 280 characters']
    },
    user_id:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
        required: [true, 'This field is required']
    },
    image: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {timeStamps:true})
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;