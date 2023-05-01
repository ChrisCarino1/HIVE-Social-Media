const Post = require('../models/post.model')
const Comment = require('../models/comment.model')
const jwt = require('jsonwebtoken')

module.exports = {

    allPosts: (req, res) => {
        Post.find()
            .then((allPosts) => {
                res.json(allPosts)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    },

    createPost: async (req, res) => {
        try{
            const decodedJwt = jwt.decode(req.cookies.userToken, {complete:true})
            console.log(decodedJwt)
            const user_id = decodedJwt.payload._id
            console.log('USER ID', user_id)
            const post = req.body
            post['user_id'] = user_id
            const username = decodedJwt.payload.username
            post['username'] = username
            const completedPost = await Post.create(post)
            console.log(completedPost)
            res.json(completedPost)
        }
        catch(err){
            res.status(500).json(err)
        }
    },

    updatePost: (req, res) => {
        Post.findOneAndUpdate( { _id: req.params.id }, req.body, { new: true, runValidators: true })
        .then(updatedPost => {
            res.json(updatedPost)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    getOnePost: async (req, res) => {
        try{
            const post_id = req.params.id
            console.log("postId:", post_id)
            const onePost = await Post.findById(post_id)
            console.log("onePost:", onePost)
            const allCommentsOnOnePost = await Comment.find({post_id:post_id})
            console.log("allComments:", allCommentsOnOnePost)
            res.json({onePost:onePost, allCommentsOnOnePost:allCommentsOnOnePost})
        }
        catch(err){
            res.status(500).json(err)
        }
    },

    deletePost: (req, res) => {
        Post.deleteOne( { _id: req.params.id })
            .then((response) => {
                res.json(response)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    },
    
    allPostsByLoggedInUser: async (req,res) => {
        try{
            console.log('USER ID FROM AUTHENTICATE',req.user);
            const idFromAuthenticate = req.user
            const allPostsByLoggedInUser = await Post.find({user_id:idFromAuthenticate})
            res.json(allPostsByLoggedInUser)
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}