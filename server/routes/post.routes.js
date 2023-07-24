const PostController = require('../controllers/post.controller')
const {authenticate} = require('../config/jwt.config')

module.exports = app => {
    app.get('/api/post/all', PostController.allPosts)
    app.get('/api/post/byLoggedInUser', authenticate, PostController.allPostsByLoggedInUser)
    app.get('/api/post/byUser/:id', PostController.allPostsByUser)
    app.post('/api/post/create', authenticate, PostController.createPost)
    app.get('/api/post/view/:id', PostController.getOnePost)
    app.put('/api/post/update/:id', authenticate, PostController.updatePost)
    app.delete('/api/post/delete/:id', PostController.deletePost)
    app.post('/api/post/like/:id', authenticate, PostController.like);
}