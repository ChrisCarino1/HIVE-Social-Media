const MessageController = require('../controllers/message.controllers');
const { authenticate } = require('../config/jwt.config')
const express = require('express')

module.exports = app => {

    app.get('/api/messages/:id', MessageController.allMessages);
    app.post('/api/messages', authenticate, MessageController.sendMessage);
}