let Promise = require('./promise');

let p = new Promise((resolve,reject)=>{
    resolve('hello');
})

p.then().then().then().then(null,function (err){
    console.log(err)
})