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
            // const { id } = req.body
            // const decodedToken = jwt.verify(req.cookies.userToken, secret);
            // const followerID = decodedToken._id

            // var newFollow = {
            //     user_id: User.findOne({_id: followerID}).populate("_id firstName lastName image username"),
            //     followed_user_id: User.findOne({_id: id}).populate("_id firstName lastName image username")
            // }

            // try{
            //     var follow = await Follow.create(newFollow)

            //     res.json(follow)
            // } 
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

    getUserFollowing: (req, res) => {
        const user_id = req.params.id
        Follow.find({user_id: user_id})
        .then((allFollowing) => {
            res.json(allFollowing)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    }
}