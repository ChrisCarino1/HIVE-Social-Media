const CommentController = require('../controllers/comment.controller')
const {authenticate} = require('../config/jwt.config')

module.exports = app => {
    app.post('/api/postComment/:id', authenticate ,CommentController.postComment)
    app.delete('/api/deleteComment/:id', CommentController.deleteComment)
    app.put('/api/updateComment/:id', authenticate, CommentController.updateComment)
    app.get('/api/viewComment/:id',authenticate, CommentController.getOneComment)
}