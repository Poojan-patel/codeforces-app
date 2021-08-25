if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
    //console.log('Configured .env') 
}
const request = require('request');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const getproblem = require('../utils/getproblem')
const getuser = require('../utils/getuser')
const User = require('../models/user')
const {Auth, Unauth} = require('../middleware/auth');
const randomstring = require('randomstring')

const {registration, forgotPassword} = require('../utils/email_auth')
const bcrypt = require('bcryptjs')

require('../db/mongoose')
const port = (process.env.PORT || 2212);

let url = new URL('https://codeforces.com/api/');
url.pathname = 'api/user.info'

const publicDir = path.join(__dirname,'..','public');
const viewDir = path.join(__dirname,'..','templates','views')
const partialDir = path.join(__dirname,'..','templates','partials')
const aceDir = path.join(__dirname,'..','ace')

// registering different paths to express app
app.set('view engine','hbs');
app.set('views',viewDir)
hbs.registerPartials(partialDir)

app.use(express.static(publicDir))
app.use(express.static(aceDir))

//Essential thing to work with post request
app.use(express.json())

app.get('/',(req,res)=>{
    if(req.query.e){
        res.render('index',{
            heading: 'Main Page',
            error: req.query.e,
        })    
    }
    else{
        res.render('index',{
            heading: 'Main Page'
        })
    }
})

app.get('/problems',(req,res)=>{
    res.render('get_problems.hbs',{
        heading: 'Problems',
    })
})

app.get('/fetchproblems',(req,res)=>{
    const regex = RegExp('[a-zA-Z]');
    if(req.query.tags === undefined || regex.test(req.query.tags) === false)
        return res.send({err: 'Invalid Query'})
    getproblem.getproblem(req.query.tags, (err, result)=>{
        if(err)
            return res.send({err});
        res.send(result);
    })
})

app.get('/compare',(req,res)=>{
    res.render('compare_it.hbs',{
        heading: 'Compare Profiles',
    })
})



app.get('/invoke',(req,res)=>{
    res.render('custom_invoke.hbs',{
        heading: 'Custom Invoke',
    })
})

app.post('/compiler',(req,res)=>{
    const url = "https://api.jdoodle.com/v1/execute";
    const program = {
        script: req.body.script,
        language: req.body.language,
        stdin: req.body.stdin,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        versionIndex: 0
    }
    request({url, method:"POST", json: program}, (error, {body:data}={})=>{
        if(error){
            return res.send(error)
        }
        res.send(data)
    })
})



app.post('/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body);
        const initialToken = "Bearer "+await user.generateAuthToken();
        return res.send({initialToken}).status(201);

    } catch (e){
        res.status(404).send({error: "Invalid Username/password"})
    }
})

app.post('/resetpassword', async(req,res)=>{
    try{
        //console.log(req.body)
        const user = await User.findOne({email:req.body.email})
        if(!user){
            throw "User Not Found";
        }
        const randomPass = randomstring.generate(10)
        //console.log(randomPass)
        user.password = randomPass;
        user.webtokens = [];
        await user.save();
        await forgotPassword(req.body.email, user.name, randomPass, (err,msg)=>{
            if(err){
                throw err;
            }
            res.status(200).send({
                updated: true
            })
        })
    } catch(error){
        res.status(404).send({
            error
        })
    }
})

app.post('/authenticate', Auth, async(req,res)=>{
    res.send({isLogged: true, user: req.user}).status(201);
})

app.post('/logout', Unauth, async(req,res)=>{
    res.send({loggedOut: true}).status(201);
})

app.get('/settings', async(req,res)=>{
    //const {name, email, mobile} = req.user;
    res.render('settings',{
        title: 'Settings',
        islogged: 1
    })
    // {
    //     name, email, mobile
    // })
})

app.post('/settings', Auth, async(req,res)=>{
    try{
        const user = req.userInfo;
        user.name = req.body.name;
        if(req.body.password)
            user.password = req.body.password;
        user.mobile = req.body.mobile;
        await user.save();
        res.send({updated: true}).status(200);
    } catch(e){
        res.send({updates: false}).status(401);
    }
})

app.post('/register',async (req,res)=>{
    
    try{
        const randomPass = randomstring.generate(10)
        req.body.password = randomPass;
        const newUser = User(req.body);
        await newUser.save();
        await registration(req.body.email, req.body.name, randomPass, (err,msg)=>{
            if(err){
                throw err;
            }
        })
        //const initialToken = "Bearer "+await newUser.generateAuthToken();
        
        //res.setHeader('AuthorizationTokens',"Bearer "+initialToken);
        //console.log(res.getHeader('AuthorizationTokens'))
        //res.writeHead(201,{'AuthorizationToken': "Bearer "+initialToken});
        return res.status(200).send({newUser});
    } catch(e){
        //console.log(e)
        return res.status(300).send(e);
    }
})

app.get('*',(req,res)=>{
    // res.render('index',{
    //     heading: 'Main Page',
    //     error: "Wrong Page Requested"
    // })
    res.redirect('/?e='+encodeURIComponent("Wrong Page Requested"))
})

app.listen(port,()=>{
    console.log('Server is listening now on:', port);
});

