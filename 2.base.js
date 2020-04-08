let fs = require('fs');
let Promise = require('./promise')
let promise = new Promise((resolve,reject)=>{
    resolve('hello')
})
let promise2 = promise.then(data=>{
    return new Promise((resolve,reject)=>{
        resolve(new Promise((resolve,reject)=>{
            resolve('hello world')
        }))
    })
})

promise2.then(data=>{
    console.log('success',data);
},err =>{
    console.log('---',err)
})
