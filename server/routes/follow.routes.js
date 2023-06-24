const followController = require('../controllers/follow.controller')
const {authenticate} = require('../config/jwt.config')

module.exports = app => {
    app.post('/api/follow/:id',authenticate ,followController.followUser),
    app.post('/api/unfollow/:id',authenticate ,followController.unfollowUser),
    app.get('/api/getUserFollowers/:id', followController.getUserFollowers),
    app.get('/api/getUserFollowing/:id', followController.getUserFollowing)
}