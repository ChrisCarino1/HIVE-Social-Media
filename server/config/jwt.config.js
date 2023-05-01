const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET_KEY

module.exports.authenticate = (req, res, next) => {
    jwt.verify(req.cookies.userToken, SECRET, (err,payload) => {
        console.log(req.cookies);
        if(err){
            console.log("Failed user verificaction")
            res.status(401).json({verified:false})
        }
        else{
            console.log('Autheticated')
            req.user = payload._id
            console.log('PAYLOAD', payload)
            next()
        }
    })
}