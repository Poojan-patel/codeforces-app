const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('This email is not valid')
        },
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    webtokens:[{
        authtoken:{
            type: String,
            required: true
        }
    }],
    mobile:{
        type: Number,
        validate(value){
            if(value.toString().length != 10 || value < 6000000000)
                throw new Error("Invalid Mobile Number")
        }
    },
})

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const authtoken = jwt.sign({_id:user._id.toString()}, 'theminiCFapppp')
    console.log(user._id, authtoken)
    user.webtokens = user.webtokens.concat({authtoken})
    await user.save()
    return authtoken;
}
 
userSchema.statics.findByCredentials = async ({email,password})=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Invalid Username/Password')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Invalid Username/Password')
    }
    return user
}

// Hashes the plain text pass before saving
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    console.log('Before Save')
    next()
    
})
const User = mongoose.model('User', userSchema)

module.exports= User;