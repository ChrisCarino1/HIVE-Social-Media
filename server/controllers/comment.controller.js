const Comment = require('../models/comment.model');
const jwt = require('jsonwebtoken')

module.exports = {
    postComment: async (req, res) => {
        
        try {
            const comment = req.body
            const decodedJwt = jwt.decode(req.cookies.userToken, {complete: true})
            const user_id = decodedJwt.payload._id
            const post_id = req.params.id 
            const username = decodedJwt.payload.username
            const finishedComment = {...comment, user_id:user_id, post_id:post_id, username:username}
            const newComment = await Comment.create(finishedComment)
            res.json(newComment)
        }
        catch(err){
            res.status(400).json({error:err})
        }
    },

    deleteComment: (req, res) => {
        console.log("Comment Id:",req.params.id)
        Comment.deleteOne( { _id: req.params.id })
            .then((response) => {
                res.json(response)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    },

    updateComment: (req, res) => {
        Comment.findOneAndUpdate( { _id: req.params.id }, req.body, { new: true, runValidators: true })
        .then(updatedPost => {
            res.json(updatedPost)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    getOneComment: async (req, res) => {
        try{
            const comment_id = req.params.id
            console.log("commentId:", comment_id)
            const oneComment = await Comment.findById(comment_id)
            console.log("oneComment:", oneComment)
            res.json({oneComment:oneComment})
        }
        catch(err){
            res.status(500).json(err)
        }
    },
}