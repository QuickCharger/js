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
await执行步骤
	1. 执行await后面的表达式
	2. 跳出await，从调用者处继续执行
	3. Promise执行了resolve后 从await处继续执行
