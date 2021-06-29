const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI;// || 'mongodb://127.0.0.1:27017/codeforces-db';
mongoose.connect(uri,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(()=>console.log('DB Connected Successfully')).catch(()=>{
    console.log('Look for the error')
})
