const request = require('request');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const getproblem = require('../utils/getproblem')
const getuser = require('../utils/getuser')
const port = (process.env.PORT || 2212);

let url = new URL('https://codeforces.com/api/');
url.pathname = 'api/user.info';

const publicDir = path.join(__dirname,'..','public');
const viewDir = path.join(__dirname,'..','templates','views')
const partialDir = path.join(__dirname,'..','templates','partials')

// registering different paths to express app
app.set('view engine','hbs');
app.set('views',viewDir)
hbs.registerPartials(partialDir)

app.use(express.static(publicDir))

//Essential thing to work with post request
app.use(express.json())

app.get('/',(req,res)=>{
    res.render('index',{
        heading: 'Main Page'
    })
})

app.get('/problems',(req,res)=>{
    res.render('get_problems.hbs',{
        heading: 'Problems'
    })
})

app.post('/getinfo',(req,res)=>{
    const handles = Object.values(req.body)
    
    getuser(handles, (error,results)=>{
        if(error)
            return res.send({error})
        else{
            return res.send(results)
        }
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
        heading: 'Compare Profiles'
    })
})

app.get('/invoke',(req,res)=>{
    res.render('custom_invoke.hbs',{
        heading: 'Custom Invoke'
    })
})

app.get('*',(req,res)=>{
    res.send({
        error: "Wrong Page Requested"
    })
})

app.listen(port,()=>{
    console.log('Server is listening now on:', port);
});

