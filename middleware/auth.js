const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async(req,res,next)=>{
    try{
        const token = req.header('CodeforcesMiniAppAuthToken').replace('Bearer ','')
        //console.log(token)
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //console.log(decoded)
        //console.log(token, decoded)
        const user = await User.findOne({_id: decoded._id, 'webtokens.authtoken': token})
        //console.log(user)
        if(!user){
            throw new Error();
        }
        req.user = {
            name: user.name,
            email: user.email,
            mobile: user.mobile
        };
        req.userInfo = user
        next();
    } catch(e){
        //console.log('User Not Found')
        res.send({isLogged: false}).status(401);
    }
    
}

const unauth = async(req,res,next)=>{
    try{
        const token = req.header('CodeforcesMiniAppAuthToken').replace('Bearer ','')
        //console.log(token)
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //console.log(decoded)
        //console.log(token, decoded)
        const user = await User.findOne({_id: decoded._id, 'webtokens.authtoken': token})
        //console.log(user)
        if(!user){
            throw new Error();
        }
        const wt = user.webtokens;
        user.webtokens.splice(wt.findIndex((tok)=>tok===token),1);
        await user.save();
        next();
    } catch(e){
        //console.log('User Not Found')
        res.send({loggedOut: false}).status(401);
    }
    
}

module.exports = {
    Auth:auth,
    Unauth: unauth
}