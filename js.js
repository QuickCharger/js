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
