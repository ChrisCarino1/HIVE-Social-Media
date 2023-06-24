const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true,
        required: [true, "Message required"],
        minlength: [1, "Must have at least one character before sending a message"]
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }
},  { timestamps: true });



module.exports = mongoose.model("Message", MessageSchema);