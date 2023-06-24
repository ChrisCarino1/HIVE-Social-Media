const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
            required: [true, 'Chat name required']
        },
        isGroupChat: {
            type: Boolean,
            default: false,
            required: [true, "IsGroupChat is required"]
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {timestamps: true}
);

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;