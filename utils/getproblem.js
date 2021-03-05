const request = require('request');

const getproblem = (tag,callback) => {
    // const regex = RegExp('[a-zA-Z0-9]');
    // if(regex.test(tag) == false)
    //     return console.log('not possible')

    const url = 'https://codeforces.com/api/problemset.problems?tags=' + encodeURIComponent(tag);
    request({url, json:true},(err,{body:data}={})=>{
        if(err)
            return callback(err,undefined);
        if(data.result === undefined || data.result.problems.length === 0)
            return callback('Problems with given tag(s) not found',undefined)
        
        data = data.result.problems;
        problems = [];
        data.forEach(({contestId, index, name, rating='unrated'} = ele)=>{
            problems.push({contestId, index, name, rating});
        })
        problems.sort((a,b)=>b.rating-a.rating)
        callback(undefined, {problems});
    })
}

module.exports = {
    getproblem: getproblem
}