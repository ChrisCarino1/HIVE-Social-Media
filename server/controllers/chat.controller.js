const Chat = require('../models/chat.model')
const asyncHandler = require("express-async-handler");
const User = require('../models/user.model')
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const decodedToken = jwt.verify(req.cookies.userToken, secret);
    console.log("token from body:", decodedToken._id)
    const loggedInUserId = decodedToken._id

    if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
    }

    var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
        { users: { $elemMatch: { $eq: loggedInUserId } } },
        { users: { $elemMatch: { $eq: userId } } },
    ],
    })
    .populate("users", "-password")
    .populate("lastMessage");

    isChat = await User.populate(isChat, {
    path: "lastMessage.sender",
    select: "firstName lastName picture email",
    });

    if (isChat.length > 0) {
    res.send(isChat[0]);
    } else {
    var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [  loggedInUserId, userId ],
    };

    try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat?._id }).populate(
        "users",
        "-password"
        );
        res.status(200).json(FullChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    }
});

const getChats = asyncHandler(async (req, res) => {
    const decodedToken = jwt.verify(req.cookies.userToken, secret);
    console.log("token from body:", decodedToken._id)
    const loggedInUserId = decodedToken._id
    try {
    Chat.find({ users: { $elemMatch: { $eq: loggedInUserId}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("lastMessage")
            .sort( {updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: "lastMessage.sender",
                select: "firstName lastName picture email",
            });
            res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
        }
    });

const createGroupChat = asyncHandler(async (req, res) => {
    const decodedToken = jwt.verify(req.cookies.userToken, secret);
    const loggedInUserId = decodedToken._id

    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }
    
    var users = JSON.parse(req.body.users);
    
    if (users.length < 2) {
        return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
    
    users.push(req.user);
    users.push(loggedInUserId)
    
    try {
        const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: loggedInUserId,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    
        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    });

const editGroupChatName = asyncHandler(async (req, res) => {
        const { chatId, name } = req.body;
        const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: name,
        },
        {
            new: true,
        }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
        if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
        } else {
        res.json(updatedChat);
        }
    });

const editGroupChatImage = asyncHandler(async (req, res) => {
    const { chatId, img } = req.body;
    console.log(chatId, img)
    const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
        groupChatImage: img,
    },
    {
        new: true,
    }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
    } else {
    res.json(updatedChat);
    }
});

const groupChatAdd = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;    
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
        $push: { users: userId },
        },
        {
        new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    
    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
    });

    const removeUser = asyncHandler(async (req, res) => {
        const { chatId, userId } = req.body;    
        const remove = await Chat.findByIdAndUpdate(
            chatId,
            {
            $pull: { users: userId },
            },
            {
            new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        
        if (!remove) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(remove );
        }
        });
    
module.exports = { accessChat, getChats, createGroupChat, editGroupChatName, editGroupChatImage, groupChatAdd, removeUser};