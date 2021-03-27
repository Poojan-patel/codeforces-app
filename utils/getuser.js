const request = require('request')
const Async = require('async')

const getuser = async (handles,callback)=>{
    if(handles.length === 0)
        return callback("No Handle Provided",undefined);
    const url = "https://codeforces.com/api/user.info?handles=";
    this.data = {
        handle:[],
        titlePhoto:[],
        firstName:[],
        lastName:[],
        rank:[],
        maxRank:[],
        rating:[],
        maxRating:[],
        country:[],
        contribution:[],
        friendOfCount:[]
    };

    const keys = Object.keys(this.data);
    xyz = []
    handles.forEach(ele=>{
        xyz.push(new Promise((resolve,reject)=>{
            request.get({url: url+encodeURIComponent(ele), json: true},(err,{body:result}={})=>{
                if(err)
                    resolve({
                        'error': 'Swap!! You are Offline!'
                    })
                else
                    resolve(result)
            })
        }))
    })
    this.ex = undefined;
    await Promise.all(xyz).then(()=>{
        xyz.forEach(ele=>{
            ele.then((resultData)=>{
                if(resultData.error)
                    this.ex = resultData.error
                else{
                    if(resultData.status === "FAILED" || resultData.result.length === 0){
                        this.ex = "Invalid Handle";
                    }
                    else{
                        resultData = resultData.result[0]
                        keys.forEach(ele=>{
                            this.data[ele].push(resultData[ele]);
                        })
                    }
                }
            })
        })
    })
    return callback(this.ex,this.data);
}

module.exports = getuser