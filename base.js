// promise 解决回调地狱 (基于回调)
//多请求并发
//new Promise是需要传递一个执行器函数,这个函数就会被执行



//1.实现自己的Promise  
//2.语法 commonjs规范
let Promise = require('./promise')
let promise = new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('1') //此时如果调用了resolve 就让刚才存储的回调执行
    }, 1000);
})
promise.then((success)=>{//如果调用then的时候没有成功也没有失败,我们就先保存成功和失败的回调
    console.log('success',success)
},(err)=>{
    console.log('fail',err)
})
promise.then((success)=>{
    console.log('success',success)
},(err)=>{
    console.log('fail',err)
})