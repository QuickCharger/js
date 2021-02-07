// 判断是否存在某个变量
if(typeof a === "undefined") {
	console.log("a undefined")
} else {
	console.log("a defined")
}

// 默认值的写法，普通变量
let r1 = typeof a !== "undefined" ? a : "3000"
console.log("result = " + r1)

// 默认值的写法，类成员
obj={}
let r2 = obj.a || '3000'
console.log("result = " + r2)

//在代码块内，使用let命令声明变量之前，该变量都是不可用的
let tmp = 123;
if (true) {
  // tmp = 'abc';   // ReferenceError
  let tmp;
}

{
  let [a,b,c] = [1,2,3]
  console.log(a + " " + b + " " + c)
}

async函数实际返回Promise
	如果返回的是非Promise也会通过Promise.resolve()封装成Promise
	如果无return则自动返回Promise.resolve(undefined)
	如果函数返回的就是Promise 则函数前面不用加async
Promise中的函数会立即执行
await执行步骤（不论后面的表达式是否是Promise）
	1. 执行await后面的表达式
	2. 跳出await，从调用者处继续执行
	3. Promise执行了resolve后 从await处继续执行。
		如果Promise一直不执行resolve，则一直不会执行await后面的代码
		如果await后面不是Promise，则执行完2后 立即执行3（不等待Promise执行resolve）

					end方法		end事件		close方法	close事件	error事件
客户端	client        ok          ok                        ok          ok     
服务器	comein  同客户端的client
服务器	server                                  ok          ok          ok     

client end方法 执行后会发送FIN包，comein会收到 1.end事件 2.close事件
client 意外中断后，comein会收到 1.error事件 2.close事件
server close方法 主动调用后，不再接收新的comein，老的comein会保持
       close事件 在所有的comein都被关闭后会被触发
详细参见 client.js server.js
