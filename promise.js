console.log('my...');

const PENDING = 'PENDING' //等待状态
const FULFILLED = 'FULFILLED'//成功状态
const REJECTED = 'REJECTED'//失败状态
const resolvePromise = (promise2,x,resolve,reject) => {
    //判断 可能你的promise要和别人的promise来混用
    // 可能不同的promise库之间要相互调用
    if(promise2 === x){ //x 如果和promise2 是同一个人 x永远不能等自己完成,直接报错
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    //----判断x的状态 判断 x 是不是 promise-----
    // 先判断是不是对象或者函数
    if(typeof x === 'object' && x!==null||typeof x === 'function'){
        // x需要为对象或者函数
        let called; //为了考虑别人的promise不健壮 所以我们需要自己去判断一下,如果调用失败不能成功,
        //调用成功不能失败,不能多次调用失败或失败
        try{
            let then = x.then;//取出then 方法 这个方法是采用defineProperty来定义的
            if(typeof then === 'function'){
                //判断then是不是一个函数,如果then不是一个函数 说明不是promise
                //只能认为他是一个promise
                then.call(x,(y)=>{ //如果x是一个promise 就采用这个promise的返回结果
                    if(called) return;
                    called  = true
                    resolvePromise(promise2,y,resolve,reject);
                },(r)=>{
                    if(called) return;
                    called  = true
                    reject(r);
                });
            }else{
                resolve(x);
            }
        }catch(e){
            if(called) return;
            called  = true
            reject(e);//取then失败了 直接触发promise2失败的逻辑
        }
    }else{
        //肯定不是promise
        resolve(x);//直接成功
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallback = [];
        this.onRejectedCallback = [];
        let resolve = (value) => {
            if(value instanceof Promise){
                return value.then(resolve,reject)
            }
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onResolvedCallback.forEach(fn => fn());//发布
            }
        }
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallback.forEach(fn => fn());
            }
        }
        //executor 执行的时候,传入两个参数给用户改变状态
        try {//只能捕获同步异常
            executor(resolve, reject);
        } catch (e) {
            reject(e)
        }

    }
    catch(errCallback){//一个没有成功的then
        return this.then(null,errCallback)
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function'?
        onFulfilled:val=>val
        onRejected = typeof onRejected === 'function'?
        onRejected:err=>{throw err}
        //递归
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) { reject(e) }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) { reject(e) }
                }, 0);

            }
            if (this.status === PENDING) {
                this.onResolvedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) { reject(e) }
                    }, 0);
                })
                this.onRejectedCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) { reject(e) }
                    }, 0);
                })
            }
        })
        return promise2
    }
}

Promise.deferred= function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject
    })
    return dfd;
}
module.exports = Promise