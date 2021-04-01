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
            error: req.query.e
        })    
    }
    else{
        res.render('index',{
            heading: 'Main Page'
        })
    }
})

app.post('/compiler',(req,res)=>{
    const url = "https://api.jdoodle.com/v1/execute";
    const program = {
        script: req.body.script,
        language: req.body.language,
        stdin: req.body.stdin,
        clientId: "608ffd4e7acfd27027b32eb0d1f9d867",
        clientSecret: "b9a6dd477fffaf6274b32625ceddd8837f80d59eaea50bec10cdd3a98058ce86",
        versionIndex: 0
    }
    request({url, method:"POST", json: program}, (error, {body:data}={})=>{
        if(error){
            return res.send(error)
        }
        res.send(data)
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
    // res.render('index',{
    //     heading: 'Main Page',
    //     error: "Wrong Page Requested"
    // })
    res.redirect('/?e='+encodeURIComponent("Wrong Page Requested"))
})

app.listen(port,()=>{
    console.log('Server is listening now on:', port);
});

