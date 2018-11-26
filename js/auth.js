const jwt = require('jsonwebtoken');
const SUPER_SECRET_KEY = process.env.TOKEN_KEY || "TransparantWindowsFlyingDonkeys";

auth = function(req,res,next){
    let token = req.headers['x-access-auth'] || req.body.token;
    try{
        let decodedToken = jwt.verify(token, SUPER_SECRET_KEY);
        req.token = decodedToken;
        next();
    } catch(err){
        res.status(401);
    }
}

module.exports = auth;