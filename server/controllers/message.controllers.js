const Message = require("../models/message.models");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose')
const secret = process.env.SECRET_KEY;
const User = require('../models/user.model')
const Chat = require('../models/chat.model')

const allMessages = asyncHandler(async (req, res) => {
  const id =  req.params.id;
  
  try {
    console.log("chatid:", id)
    const messages = await Message.find({ chat: id })
      .populate("sender", "firstName lastName picture email username")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  const decodedToken = jwt.verify(req.cookies.userToken, secret);
  console.log("token from body:", decodedToken._id)
  const loggedInUserId = decodedToken._id

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: loggedInUserId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "firstName lastName image username")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName image email username",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { lastMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };