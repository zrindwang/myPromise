//generator es6语法 promise
// function * gen(){
//     let r1 = yield 1;
//     console.log(r1)
//     let r2 = yield 2;
// }

// let it = gen();
// console.log(it.next())
// console.log(it.next(5))// 当调用next方法时传递的参数,会给上一次yield赋值
// console.log(it.next())


//应用场景
let fs = require('fs').promises;
function * read(){
    let content = yield fs.readFile('./name.txt','utf8');
    let age =  yield fs.readFile(content,'utf8');
    return age;
}

//co实现 tj写的

// function co(it){
//     return new Promise((resolve,reject)=>{
//         function next(data){
//             let {value,done} = it.next(data);
//             if(!done){
//                 Promise.resolve(value).then(data=>{
//                     next(data);
//                 },reject)
//             }else{
//                 resolve(value);//将最终的结果 返回给当前 co的promise
//             }
//         }
//         next();
//     })
// }

// co(read()).then(data=>{
//     console.log(data)
// })


//我希望用 async + await 来模拟Promise.all
function fn1(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(1)
        }, 1000);
    })
}
function fn2(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(2)
        }, 2000);
    })
}
function fn3(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            resolve(3)
        }, 3000);
    })
}
async function asyncAlls(promises){
    let arr = [];
    for(let p of promises){
        arr.push(await p)
    }
    return arr;
}

async function readAll(){
    console.time('start')
    let r = await asyncAlls([fn1(),fn2(),fn3()])
    console.time('end')
    return r
}

readAll().then(data=>{
    console.log(data);
})