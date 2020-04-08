let fs = require('fs').promises
function promisify(fn){
    return function(...args){
        return new Promise((resolve,reject)=>{
            fn(...args,function(err,data){
                if(err) reject();
                resolve(data);
            })
        })
    }
}
//将node中api 转换成promise写法
//promise 化
//let read = util.promisify(fs.readFile)
// let read = promisify(fs.readFile)
// fs.readFile('name.txt','utf8').then(data=>{
//     console.log(data);
// })
const isPromise = value =>{
    if(value instanceof Promise) return true;
    return false
}
Promise.all = function(promises){
    return new Promise((resolve,reject)=>{
        let arr = [];//返回的数组
        let i = 0;
        let processData = (index,data)=>{
            arr[index] = data;
            if(++i === promises.length){
                resolve(arr)
            }
        }
        for(let i =0;i<promises.length;i++){
            let current = promises[i];
            if(isPromise(current)){
                current.then(data=>{
                    processData(i,data)
                },reject)
            }else{
                processData(i,current)
            }
        }
    })
}
// Promise.all([1,2,3,fs.readFile('name.txt','utf8'),fs.readFile('age.txt','utf8')]).then(
//     values =>{
//         console.log(values)
//     },err=>{
//         console.log(err)
//     }
// )

//Promise.race 赛跑 谁是第一个完成的 就用他的结果，如果失败这个promise失败，如果成功，这个promise就成功
Promise.race = function(promises){
    return new Promise((resolve,reject)=>{
        for(let i = 0;i<promises.length;i++){
            let current = promises[i];
            if(isPromise(current)){
                current.then(resolve,reject)
            }else{
                resolve(current)
            }
        }
    })
}

// Promise.race([fs.readFile('name.txt','utf8'),fs.readFile('age.txt','utf8')]).then(
//     value =>{
//         console.log(value)
//     },err=>{
//         console.log(err)
//     }
// )

Promise.prototype.finally = function(callback){
    return this.then(value=>{
        return Promise.resolve(callback()).then(()=>value)
    },err=>{
        return Promise.resolve(callback()).then(()=>{throw err})
    })
}