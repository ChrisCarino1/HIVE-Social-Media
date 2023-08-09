const Follow = require('../models/follow.model');
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_KEY;
const User = require('../models/user.model')

module.exports = {
    followUser: async (req, res) => {
        console.log(req.body)
        try {
            decodedJwt = jwt.decode(req.cookies.userToken, {complete: true})
            const user_id = decodedJwt.payload._id
            const followed_user_id = req.params.id
            const finishedFollow = {user_id: await User.findById(user_id).populate("_id username image"), followed_user_id: await User.findById(followed_user_id).populate("_id username image")}
            const newFollow = await Follow.create(finishedFollow)
            console.log("newFollow", newFollow)
            res.json(newFollow)
        }
        catch(err){
            res.status(400).json({error:err})
        }
    },

    unfollowUser: (req, res) => {
            decodedJwt = jwt.decode(req.cookies.userToken, {complete: true})
            const user_id = decodedJwt.payload._id
            const followed_user_id = req.params.id

            Follow.deleteOne({user_id: user_id, followed_user_id: followed_user_id})
            .then((response) =>{
                console.log("response", response)
                res.json(response)
            })
            .catch((err) => {
                res.status(500).json(err)
            })
    },

    getUserFollowers: (req, res) => {
        const user_id = req.params.id
        Follow.find({followed_user_id: user_id})
        .then((allFollowers) => {
            res.json(allFollowers)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },

    getUserFollowing: async (req, res) => {
        try {
            const user_id = req.params.id
            const following = await Follow.find({user_id: user_id})
            res.json(following)
        }
        catch(err){
            res.status(400).json({error:err})
        }
    }
}