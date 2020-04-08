let fs = require('fs');
//有关联的请求 需要先通过第一个人读取操作拿到返回结果,通过这个结果再去读取另一个文件
// 上一个人的输出是下一个人的输入
// fs.readFile('./name.txt','utf8',function(err,data){
//     fs.readFile(data,'utf8',function(err,data){
//         console.log(data)
//     })
// })

function read(){
    return new Promise((resolve,reject)=>{
        fs.readFile(...arguments,function(err,data){
            if(err){
                reject(err)
            }
            resolve(data);
        })
    })
}
//promise 通过链式调用方式解决这个问题
//成功的回调和失败的回调都可以返回一个结果
//情况1:如果返回的是一个promise, 那个会让这个promise执行,并且采用他的状态将成功或失败的结果传递到外层的下一个then中
//情况2:如果返回的是一个普通值会把这个值作为外层的下一次then的成功回调中
//情况3:抛出一个异常
read('name.txt','utf8').then((data)=>{
   return read(data+'1','utf8')
}).then((data)=>{
    console.log(data)
},err=>{
    return 100
}).then((data)=>{
    console.log(data)
    throw new Error('error')
}).catch(err=>{
    console.log('只要上面没有捕获错误 就会执行这个catch')
})

//promise如何实现链式调用  jq返回的this,promise的链式调用 返回一个新的promise
//promise必须返回一个全新的promise 这样可以解决promise的状态问题,否则会出现promise刚开始成功又变成了失败态
