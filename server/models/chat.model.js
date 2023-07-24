const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
            required: false,
            default: "Group Chat"
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
        groupChatImage: { 
            type: String,
            default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
        }
    },
    {timestamps: true}
);

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;